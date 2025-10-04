-- EMERGENCY DATABASE CLEANUP: Remove duplicate questions and fix RLS policies (CORRECTED)

-- Step 1: Create backup of current questions
CREATE TABLE IF NOT EXISTS questions_backup AS SELECT * FROM questions;

-- Step 2: Identify and mark duplicate questions (keep only best 50 per country)
WITH ranked_questions AS (
  SELECT 
    id,
    country_id,
    text,
    ROW_NUMBER() OVER (
      PARTITION BY country_id, 
      LOWER(TRIM(text)) 
      ORDER BY 
        created_at DESC,
        CASE WHEN ai_generated = false THEN 0 ELSE 1 END,
        CASE WHEN explanation IS NOT NULL AND LENGTH(explanation) > 20 THEN 0 ELSE 1 END
    ) as rn,
    ROW_NUMBER() OVER (
      PARTITION BY country_id 
      ORDER BY 
        created_at DESC,
        CASE WHEN ai_generated = false THEN 0 ELSE 1 END,
        CASE WHEN explanation IS NOT NULL AND LENGTH(explanation) > 20 THEN 0 ELSE 1 END
    ) as country_rn
  FROM questions 
  WHERE country_id IS NOT NULL
),
questions_to_delete AS (
  SELECT id 
  FROM ranked_questions 
  WHERE rn > 1 OR country_rn > 50
)
DELETE FROM questions 
WHERE id IN (SELECT id FROM questions_to_delete);

-- Step 3: Fix RLS policies for proper admin access
DROP POLICY IF EXISTS "Admins can insert questions" ON questions;
DROP POLICY IF EXISTS "Admins can update questions" ON questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON questions;

CREATE POLICY "Admin full access to questions"
ON questions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Step 4: Create game rooms table for real-time multiplayer
CREATE TABLE IF NOT EXISTS game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_code VARCHAR(6) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  max_players INTEGER DEFAULT 50 CHECK (max_players > 0 AND max_players <= 100),
  current_players INTEGER DEFAULT 0 CHECK (current_players >= 0),
  questions_per_game INTEGER DEFAULT 10 CHECK (questions_per_game > 0 AND questions_per_game <= 50),
  time_per_question INTEGER DEFAULT 30 CHECK (time_per_question > 0 AND time_per_question <= 300),
  country_filter VARCHAR(255),
  difficulty_filter VARCHAR(20) CHECK (difficulty_filter IN ('easy', 'medium', 'hard')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Step 5: Create game sessions table for tracking active games
CREATE TABLE IF NOT EXISTS game_sessions_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  current_question_index INTEGER DEFAULT 0,
  question_set JSONB NOT NULL DEFAULT '[]',
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  total_questions INTEGER DEFAULT 10,
  settings JSONB DEFAULT '{}'
);

-- Step 6: Create player responses table for real-time tracking
CREATE TABLE IF NOT EXISTS player_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions_v2(id) ON DELETE CASCADE,
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question_id VARCHAR(255) NOT NULL,
  answer_choice VARCHAR(1) CHECK (answer_choice IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN,
  response_time INTEGER,
  points_earned INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, player_id, question_index)
);

-- Step 7: Create room participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  current_score INTEGER DEFAULT 0,
  current_rank INTEGER DEFAULT 0,
  is_ready BOOLEAN DEFAULT false,
  is_connected BOOLEAN DEFAULT true,
  UNIQUE(room_id, player_id)
);

-- Step 8: Add RLS policies for new tables
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;

-- Game rooms policies
CREATE POLICY "Users can create game rooms"
ON game_rooms FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can view active game rooms"
ON game_rooms FOR SELECT
TO authenticated
USING (status IN ('waiting', 'active'));

CREATE POLICY "Hosts can update their rooms"
ON game_rooms FOR UPDATE
TO authenticated
USING (auth.uid() = host_id);

-- Game sessions policies
CREATE POLICY "Participants can view game sessions"
ON game_sessions_v2 FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM room_participants rp
    WHERE rp.room_id = game_sessions_v2.room_id 
    AND rp.player_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM game_rooms gr
    WHERE gr.id = game_sessions_v2.room_id 
    AND gr.host_id = auth.uid()
  )
);

-- Player responses policies
CREATE POLICY "Players can insert their own responses"
ON player_responses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Players can view session responses"
ON player_responses FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM game_sessions_v2 gs
    JOIN game_rooms gr ON gs.room_id = gr.id
    WHERE gs.id = player_responses.session_id
    AND (
      gr.host_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM room_participants rp
        WHERE rp.room_id = gr.id 
        AND rp.player_id = auth.uid()
      )
    )
  )
);

-- Room participants policies
CREATE POLICY "Players can join rooms"
ON room_participants FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Participants can view room members"
ON room_participants FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM room_participants rp2
    WHERE rp2.room_id = room_participants.room_id 
    AND rp2.player_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM game_rooms gr
    WHERE gr.id = room_participants.room_id 
    AND gr.host_id = auth.uid()
  )
);

CREATE POLICY "Players can update their participation status"
ON room_participants FOR UPDATE
TO authenticated
USING (auth.uid() = player_id);

-- Step 9: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_country_difficulty ON questions(country_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_room_code ON game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_player_responses_session_player ON player_responses(session_id, player_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_player ON room_participants(room_id, player_id);

-- Step 10: Update question count statistics
UPDATE countries SET 
  updated_at = NOW()
WHERE id IN (
  SELECT DISTINCT country_id 
  FROM questions 
  WHERE country_id IS NOT NULL
);

-- Add helpful comments
COMMENT ON TABLE game_rooms IS 'Real-time multiplayer game rooms with Kahoot-style functionality';
COMMENT ON TABLE game_sessions_v2 IS 'Active game sessions with question sets and timing';
COMMENT ON TABLE player_responses IS 'Real-time player answers and scoring';
COMMENT ON TABLE room_participants IS 'Players in each game room with status tracking';