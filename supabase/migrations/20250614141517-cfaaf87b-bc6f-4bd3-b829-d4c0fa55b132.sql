
-- Create community questions table
CREATE TABLE public.community_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    country_id VARCHAR(50) REFERENCES countries(id) NOT NULL,
    text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(10) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    votes_up INTEGER DEFAULT 0,
    votes_down INTEGER DEFAULT 0,
    moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMP,
    moderation_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create question votes table
CREATE TABLE public.question_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES community_questions(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL, -- 'up' or 'down'
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Create monthly question rotation tracking
CREATE TABLE public.question_rotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_id VARCHAR(50) REFERENCES countries(id) NOT NULL,
    rotation_month DATE NOT NULL, -- First day of the month
    questions_generated INTEGER DEFAULT 0,
    rotation_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(country_id, rotation_month)
);

-- Add indexes for performance
CREATE INDEX idx_community_questions_status ON community_questions(status);
CREATE INDEX idx_community_questions_country ON community_questions(country_id);
CREATE INDEX idx_community_questions_created ON community_questions(created_at DESC);
CREATE INDEX idx_question_votes_question ON question_votes(question_id);
CREATE INDEX idx_question_rotations_month ON question_rotations(rotation_month);

-- Enable RLS
ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_rotations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community questions
CREATE POLICY "Anyone can view approved community questions" ON community_questions
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can submit community questions" ON community_questions
    FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can view their own submissions" ON community_questions
    FOR SELECT USING (auth.uid() = submitted_by);

-- RLS Policies for question votes
CREATE POLICY "Users can vote on community questions" ON question_votes
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for question rotations (admin only for now)
CREATE POLICY "Public can view rotation status" ON question_rotations
    FOR SELECT USING (true);
