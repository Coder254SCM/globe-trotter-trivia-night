-- Create comprehensive database schema for a complete quiz game

-- 1. Enhanced user profiles table with trigger for auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, total_score, questions_answered, correct_answers, countries_mastered, individual_rank)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email), 
    0, 
    0, 
    0, 
    0, 
    0
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user auto-profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Enhanced quiz sessions with better tracking
ALTER TABLE quiz_sessions 
ADD COLUMN IF NOT EXISTS challenge_id UUID REFERENCES weekly_challenges(id),
ADD COLUMN IF NOT EXISTS quiz_type VARCHAR(50) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS started_by UUID REFERENCES user_profiles(id);

-- 3. Real-time multiplayer sessions table
CREATE TABLE IF NOT EXISTS public.multiplayer_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES user_profiles(id),
  room_code VARCHAR(10) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting', -- waiting, active, completed
  max_players INTEGER DEFAULT 8,
  current_players INTEGER DEFAULT 0,
  questions_per_round INTEGER DEFAULT 10,
  time_per_question INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- 4. Multiplayer participants table
CREATE TABLE IF NOT EXISTS public.multiplayer_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES multiplayer_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  current_score INTEGER DEFAULT 0,
  current_position INTEGER DEFAULT 0,
  is_ready BOOLEAN DEFAULT FALSE,
  UNIQUE(session_id, user_id)
);

-- 5. Game achievements system
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  requirement_type VARCHAR(50) NOT NULL, -- score, streak, countries, etc
  requirement_value INTEGER NOT NULL,
  badge_color VARCHAR(20) DEFAULT 'bronze',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. User achievements tracking
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- 7. Question statistics for analytics
CREATE TABLE IF NOT EXISTS public.question_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id VARCHAR NOT NULL REFERENCES questions(id),
  times_asked INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  average_time_seconds NUMERIC DEFAULT 0,
  difficulty_rating NUMERIC DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- 8. Daily/Weekly leaderboard snapshots
CREATE TABLE IF NOT EXISTS public.leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  rankings JSONB NOT NULL, -- Store top 100 rankings
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. User streaks and statistics
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_quiz_date DATE,
  total_time_played INTEGER DEFAULT 0, -- in seconds
  favorite_category VARCHAR(100),
  average_score NUMERIC DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 10. Friend system
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES user_profiles(id),
  addressee_id UUID NOT NULL REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- Insert default achievements
INSERT INTO achievements (name, description, requirement_type, requirement_value, badge_color) VALUES
('First Steps', 'Complete your first quiz', 'quizzes_completed', 1, 'bronze'),
('Quiz Master', 'Complete 50 quizzes', 'quizzes_completed', 50, 'silver'),
('Perfect Score', 'Get 100% on a quiz', 'perfect_scores', 1, 'gold'),
('World Explorer', 'Master 10 countries', 'countries_mastered', 10, 'silver'),
('Globe Trotter', 'Master 50 countries', 'countries_mastered', 50, 'gold'),
('Speed Demon', 'Answer 10 questions in under 5 seconds each', 'fast_answers', 10, 'platinum'),
('Streak Master', 'Maintain a 7-day streak', 'daily_streak', 7, 'gold'),
('Social Butterfly', 'Add 5 friends', 'friends_count', 5, 'bronze')
ON CONFLICT DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE multiplayer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE multiplayer_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Multiplayer sessions
CREATE POLICY "Users can view active multiplayer sessions" ON multiplayer_sessions
  FOR SELECT USING (status = 'waiting' OR status = 'active');

CREATE POLICY "Users can create multiplayer sessions" ON multiplayer_sessions
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their sessions" ON multiplayer_sessions
  FOR UPDATE USING (auth.uid() = host_id);

-- Multiplayer participants
CREATE POLICY "Participants can view session members" ON multiplayer_participants
  FOR SELECT USING (
    auth.uid() = user_id OR 
    session_id IN (SELECT id FROM multiplayer_sessions WHERE host_id = auth.uid())
  );

CREATE POLICY "Users can join sessions" ON multiplayer_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- User achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Question stats
CREATE POLICY "Question stats are viewable by everyone" ON question_stats
  FOR SELECT USING (true);

-- Leaderboard snapshots
CREATE POLICY "Leaderboard snapshots are viewable by everyone" ON leaderboard_snapshots
  FOR SELECT USING (true);

-- User stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);

-- Friendships
CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friendship requests" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendship status" ON friendships
  FOR UPDATE USING (auth.uid() = addressee_id OR auth.uid() = requester_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_multiplayer_sessions_status ON multiplayer_sessions(status);
CREATE INDEX IF NOT EXISTS idx_multiplayer_sessions_room_code ON multiplayer_sessions(room_code);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_question_stats_question_id ON question_stats(question_id);
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_id);

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats when quiz session completes
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    INSERT INTO user_stats (user_id, current_streak, longest_streak, last_quiz_date, total_time_played)
    VALUES (NEW.user_id, 1, 1, CURRENT_DATE, COALESCE(NEW.time_taken, 0))
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak = CASE 
        WHEN user_stats.last_quiz_date = CURRENT_DATE - INTERVAL '1 day' 
        THEN user_stats.current_streak + 1
        ELSE 1
      END,
      longest_streak = GREATEST(user_stats.longest_streak, 
        CASE 
          WHEN user_stats.last_quiz_date = CURRENT_DATE - INTERVAL '1 day' 
          THEN user_stats.current_streak + 1
          ELSE 1
        END),
      last_quiz_date = CURRENT_DATE,
      total_time_played = user_stats.total_time_played + COALESCE(NEW.time_taken, 0);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_trigger
  AFTER UPDATE ON quiz_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();