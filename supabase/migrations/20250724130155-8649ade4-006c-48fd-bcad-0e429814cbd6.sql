-- Phase 1: Critical Database Security Fixes

-- 1. Enable RLS on questions table (if not already enabled)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- 2. Create proper RLS policies for questions table
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
DROP POLICY IF EXISTS "Only admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Only admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Only admins can delete questions" ON public.questions;

-- Public read access for approved questions
CREATE POLICY "Public can view questions" ON public.questions
FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admins can insert questions" ON public.questions
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

CREATE POLICY "Admins can update questions" ON public.questions
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

CREATE POLICY "Admins can delete questions" ON public.questions
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- 3. Secure database functions with proper search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Update user stats when quiz session completes
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    INSERT INTO public.user_stats (user_id, current_streak, longest_streak, last_quiz_date, total_time_played)
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
$$;

CREATE OR REPLACE FUNCTION public.validate_question_content()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  placeholder_buzzword_regex TEXT := '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\]|methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d]|with specialized parameters|with novel framework|with enhanced precision|with optimized protocols|advanced methodology|cutting-edge approach|innovative technique|state-of-the-art method)';
BEGIN
  IF NEW.text ~* placeholder_buzzword_regex THEN
    RAISE EXCEPTION 'Question contains placeholder text or generic buzzwords that must be replaced: %', NEW.text;
  END IF;

  IF CONCAT(NEW.option_a, NEW.option_b, NEW.option_c, NEW.option_d) ~* placeholder_buzzword_regex THEN
    RAISE EXCEPTION 'Question options contain placeholder text or generic buzzwords that must be replaced';
  END IF;

  IF NEW.correct_answer NOT IN (NEW.option_a, NEW.option_b, NEW.option_c, NEW.option_d) THEN
    RAISE EXCEPTION 'Correct answer "%" does not match any of the provided options', NEW.correct_answer;
  END IF;

  IF LENGTH(NEW.text) < 20 THEN
    RAISE EXCEPTION 'Question text too short (minimum 20 characters): %', NEW.text;
  END IF;

  DECLARE
    options_arr TEXT[];
    unique_options_count INT;
  BEGIN
    options_arr := ARRAY[NEW.option_a, NEW.option_b, NEW.option_c, NEW.option_d];
    SELECT COUNT(DISTINCT T.opt) INTO unique_options_count FROM unnest(options_arr) AS T(opt) WHERE T.opt IS NOT NULL;
    IF unique_options_count < array_length(options_arr, 1) THEN
       RAISE EXCEPTION 'Question has duplicate answer options';
    END IF;
  END;

  IF NEW.difficulty NOT IN ('easy', 'medium', 'hard') THEN
    RAISE EXCEPTION 'Invalid difficulty level: %. Must be easy, medium, or hard', NEW.difficulty;
  END IF;

  IF NEW.country_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.countries WHERE id = NEW.country_id) THEN
      RAISE EXCEPTION 'Invalid country_id: %. Country does not exist', NEW.country_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.pre_validate_question(p_text text, p_option_a text, p_option_b text, p_option_c text, p_option_d text, p_correct_answer text, p_difficulty text DEFAULT 'medium'::text, p_country_id text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  validation_result JSON;
  issues TEXT[] := '{}';
  severity TEXT := 'low';
  placeholder_buzzword_regex TEXT := '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\]|methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d]|with specialized parameters|with novel framework|with enhanced precision|with optimized protocols|advanced methodology|cutting-edge approach|innovative technique|state-of-the-art method)';
BEGIN
  IF p_text ~* placeholder_buzzword_regex THEN
    issues := array_append(issues, 'CRITICAL: Question contains placeholder text or generic buzzwords');
    severity := 'critical';
  END IF;

  IF CONCAT(p_option_a, p_option_b, p_option_c, p_option_d) ~* placeholder_buzzword_regex THEN
    issues := array_append(issues, 'CRITICAL: Options contain placeholder text or generic buzzwords');
    severity := 'critical';
  END IF;

  IF p_correct_answer NOT IN (p_option_a, p_option_b, p_option_c, p_option_d) THEN
    issues := array_append(issues, 'CRITICAL: Correct answer does not match any option');
    severity := 'critical';
  END IF;

  IF LENGTH(p_text) < 20 THEN
    issues := array_append(issues, 'Question text too short');
    IF severity != 'critical' THEN severity := 'high'; END IF;
  END IF;

  DECLARE
    options_arr TEXT[];
    unique_options_count INT;
  BEGIN
    options_arr := ARRAY[p_option_a, p_option_b, p_option_c, p_option_d];
    SELECT COUNT(DISTINCT T.opt) INTO unique_options_count FROM unnest(options_arr) AS T(opt) WHERE T.opt IS NOT NULL;
    IF unique_options_count < array_length(options_arr, 1) THEN
       issues := array_append(issues, 'Duplicate answer options detected');
       IF severity = 'low' THEN severity := 'medium'; END IF;
    END IF;
  END;

  IF p_difficulty NOT IN ('easy', 'medium', 'hard') THEN
    issues := array_append(issues, 'Invalid difficulty level');
    severity := 'critical';
  END IF;

  validation_result := json_build_object(
    'isValid', array_length(issues, 1) IS NULL,
    'issues', issues,
    'severity', severity,
    'questionText', LEFT(p_text, 60) || '...'
  );

  RETURN validation_result;
END;
$$;

-- 4. Create admin bootstrap function (one-time use)
CREATE OR REPLACE FUNCTION public.bootstrap_admin_user(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Add admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;