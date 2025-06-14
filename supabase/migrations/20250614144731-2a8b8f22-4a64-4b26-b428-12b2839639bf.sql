
-- Create user roles enum and table (if not exists)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create weekly challenges table
CREATE TABLE IF NOT EXISTS public.weekly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  question_ids TEXT[] NOT NULL,
  participants INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (week_start)
);

-- Create user challenge attempts table
CREATE TABLE IF NOT EXISTS public.user_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.weekly_challenges(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NOW(),
  questions_correct INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  UNIQUE (user_id, challenge_id)
);

-- Enable RLS on tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_attempts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for weekly_challenges
DROP POLICY IF EXISTS "Anyone can view weekly challenges" ON public.weekly_challenges;
CREATE POLICY "Anyone can view weekly challenges"
  ON public.weekly_challenges FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage weekly challenges" ON public.weekly_challenges;
CREATE POLICY "Admins can manage weekly challenges"
  ON public.weekly_challenges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_challenge_attempts
DROP POLICY IF EXISTS "Users can view their own attempts" ON public.user_challenge_attempts;
CREATE POLICY "Users can view their own attempts"
  ON public.user_challenge_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own attempts" ON public.user_challenge_attempts;
CREATE POLICY "Users can insert their own attempts"
  ON public.user_challenge_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all attempts" ON public.user_challenge_attempts;
CREATE POLICY "Admins can view all attempts"
  ON public.user_challenge_attempts FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for failed_questions
DROP POLICY IF EXISTS "Users can view their own failed questions" ON public.failed_questions;
CREATE POLICY "Users can view their own failed questions"
  ON public.failed_questions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own failed questions" ON public.failed_questions;
CREATE POLICY "Users can insert their own failed questions"
  ON public.failed_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own failed questions" ON public.failed_questions;
CREATE POLICY "Users can update their own failed questions"
  ON public.failed_questions FOR UPDATE
  USING (auth.uid() = user_id);
