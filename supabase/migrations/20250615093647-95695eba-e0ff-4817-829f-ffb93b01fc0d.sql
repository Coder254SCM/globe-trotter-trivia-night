
-- Create a new migration to enhance question validation logic
CREATE OR REPLACE FUNCTION public.validate_question_content()
RETURNS TRIGGER AS $$
DECLARE
  -- Enhanced regex to detect generic buzzwords and placeholders
  placeholder_buzzword_regex TEXT := '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\]|methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d]|with specialized parameters|with novel framework|with enhanced precision|with optimized protocols|advanced methodology|cutting-edge approach|innovative technique|state-of-the-art method)';
BEGIN
  -- Check for placeholder text patterns in question text
  IF NEW.text ~* placeholder_buzzword_regex THEN
    RAISE EXCEPTION 'Question contains placeholder text or generic buzzwords that must be replaced: %', NEW.text;
  END IF;

  -- Check if any option contains placeholder text or buzzwords
  IF CONCAT(NEW.option_a, NEW.option_b, NEW.option_c, NEW.option_d) ~* placeholder_buzzword_regex THEN
    RAISE EXCEPTION 'Question options contain placeholder text or generic buzzwords that must be replaced';
  END IF;

  -- Validate correct answer matches one of the options
  IF NEW.correct_answer NOT IN (NEW.option_a, NEW.option_b, NEW.option_c, NEW.option_d) THEN
    RAISE EXCEPTION 'Correct answer "%" does not match any of the provided options', NEW.correct_answer;
  END IF;

  -- Check for minimum quality standards
  IF LENGTH(NEW.text) < 20 THEN
    RAISE EXCEPTION 'Question text too short (minimum 20 characters): %', NEW.text;
  END IF;

  -- Check for duplicate options (among non-null options)
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

  -- Validate difficulty level
  IF NEW.difficulty NOT IN ('easy', 'medium', 'hard') THEN
    RAISE EXCEPTION 'Invalid difficulty level: %. Must be easy, medium, or hard', NEW.difficulty;
  END IF;

  -- Check country assignment if provided
  IF NEW.country_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.countries WHERE id = NEW.country_id) THEN
      RAISE EXCEPTION 'Invalid country_id: %. Country does not exist', NEW.country_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update the pre-validation function to use the same enhanced logic
CREATE OR REPLACE FUNCTION public.pre_validate_question(
  p_text TEXT,
  p_option_a TEXT,
  p_option_b TEXT, 
  p_option_c TEXT,
  p_option_d TEXT,
  p_correct_answer TEXT,
  p_difficulty TEXT DEFAULT 'medium',
  p_country_id TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  validation_result JSON;
  issues TEXT[] := '{}';
  severity TEXT := 'low';
  -- Use the same enhanced regex as the trigger
  placeholder_buzzword_regex TEXT := '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\]|methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d]|with specialized parameters|with novel framework|with enhanced precision|with optimized protocols|advanced methodology|cutting-edge approach|innovative technique|state-of-the-art method)';
BEGIN
  -- Check for placeholder patterns in question text
  IF p_text ~* placeholder_buzzword_regex THEN
    issues := array_append(issues, 'CRITICAL: Question contains placeholder text or generic buzzwords');
    severity := 'critical';
  END IF;

  -- Check options for placeholders
  IF CONCAT(p_option_a, p_option_b, p_option_c, p_option_d) ~* placeholder_buzzword_regex THEN
    issues := array_append(issues, 'CRITICAL: Options contain placeholder text or generic buzzwords');
    severity := 'critical';
  END IF;

  -- Validate correct answer
  IF p_correct_answer NOT IN (p_option_a, p_option_b, p_option_c, p_option_d) THEN
    issues := array_append(issues, 'CRITICAL: Correct answer does not match any option');
    severity := 'critical';
  END IF;

  -- Check length
  IF LENGTH(p_text) < 20 THEN
    issues := array_append(issues, 'Question text too short');
    IF severity != 'critical' THEN severity := 'high'; END IF;
  END IF;

  -- Check for duplicate options
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

  -- Validate difficulty
  IF p_difficulty NOT IN ('easy', 'medium', 'hard') THEN
    issues := array_append(issues, 'Invalid difficulty level');
    severity := 'critical';
  END IF;

  -- Build result
  validation_result := json_build_object(
    'isValid', array_length(issues, 1) IS NULL,
    'issues', issues,
    'severity', severity,
    'questionText', LEFT(p_text, 60) || '...'
  );

  RETURN validation_result;
END;
$$ LANGUAGE plpgsql;
