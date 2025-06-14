
-- Re-enable medium and easy difficulty support in validation trigger
CREATE OR REPLACE FUNCTION validate_question_content()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for placeholder text patterns (CRITICAL validation)
  IF NEW.text ~* '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\]|methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d])' THEN
    RAISE EXCEPTION 'Question contains placeholder text that must be replaced: %', NEW.text;
  END IF;

  -- Check if any option contains placeholder text
  IF NEW.option_a ~* '(option a for|incorrect option|placeholder|methodology a|approach a|technique a|method a)' OR
     NEW.option_b ~* '(option b for|incorrect option|placeholder|methodology b|approach b|technique b|method b)' OR  
     NEW.option_c ~* '(option c for|incorrect option|placeholder|methodology c|approach c|technique c|method c)' OR
     NEW.option_d ~* '(option d for|incorrect option|placeholder|methodology d|approach d|technique d|method d)' THEN
    RAISE EXCEPTION 'Question options contain placeholder text that must be replaced';
  END IF;

  -- Validate correct answer matches one of the options
  IF NEW.correct_answer NOT IN (NEW.option_a, NEW.option_b, NEW.option_c, NEW.option_d) THEN
    RAISE EXCEPTION 'Correct answer "%" does not match any of the provided options', NEW.correct_answer;
  END IF;

  -- Check for minimum quality standards
  IF LENGTH(NEW.text) < 20 THEN
    RAISE EXCEPTION 'Question text too short (minimum 20 characters): %', NEW.text;
  END IF;

  -- Check for duplicate options
  IF NEW.option_a = NEW.option_b OR NEW.option_a = NEW.option_c OR NEW.option_a = NEW.option_d OR
     NEW.option_b = NEW.option_c OR NEW.option_b = NEW.option_d OR NEW.option_c = NEW.option_d THEN
    RAISE EXCEPTION 'Question has duplicate answer options';
  END IF;

  -- Validate difficulty level - NOW SUPPORTS ALL THREE LEVELS
  IF NEW.difficulty NOT IN ('easy', 'medium', 'hard') THEN
    RAISE EXCEPTION 'Invalid difficulty level: %. Must be easy, medium, or hard', NEW.difficulty;
  END IF;

  -- Check country assignment if provided
  IF NEW.country_id IS NOT NULL THEN
    -- Verify country exists
    IF NOT EXISTS (SELECT 1 FROM public.countries WHERE id = NEW.country_id) THEN
      RAISE EXCEPTION 'Invalid country_id: %. Country does not exist', NEW.country_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update pre-validation function to support all difficulties
CREATE OR REPLACE FUNCTION pre_validate_question(
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
BEGIN
  -- Enhanced placeholder pattern detection
  IF p_text ~* '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\]|methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d])' THEN
    issues := array_append(issues, 'CRITICAL: Question contains placeholder text');
    severity := 'critical';
  END IF;

  -- Check options for placeholders with enhanced patterns
  IF p_option_a ~* '(option a for|incorrect option|placeholder|methodology a|approach a|technique a|method a)' OR
     p_option_b ~* '(option b for|incorrect option|placeholder|methodology b|approach b|technique b|method b)' OR
     p_option_c ~* '(option c for|incorrect option|placeholder|methodology c|approach c|technique c|method c)' OR
     p_option_d ~* '(option d for|incorrect option|placeholder|methodology d|approach d|technique d|method d)' THEN
    issues := array_append(issues, 'CRITICAL: Options contain placeholder text');
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

  -- Check for duplicates
  IF p_option_a = p_option_b OR p_option_a = p_option_c OR p_option_a = p_option_d OR
     p_option_b = p_option_c OR p_option_b = p_option_d OR p_option_c = p_option_d THEN
    issues := array_append(issues, 'Duplicate answer options detected');
    IF severity = 'low' THEN severity := 'medium'; END IF;
  END IF;

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
