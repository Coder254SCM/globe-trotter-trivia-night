
-- Create a comprehensive question validation trigger function
CREATE OR REPLACE FUNCTION validate_question_content()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for placeholder text patterns (CRITICAL validation)
  IF NEW.text ~* '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\])' THEN
    RAISE EXCEPTION 'Question contains placeholder text that must be replaced: %', NEW.text;
  END IF;

  -- Check if any option contains placeholder text
  IF NEW.option_a ~* '(option a for|incorrect option|placeholder)' OR
     NEW.option_b ~* '(option b for|incorrect option|placeholder)' OR  
     NEW.option_c ~* '(option c for|incorrect option|placeholder)' OR
     NEW.option_d ~* '(option d for|incorrect option|placeholder)' THEN
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

  -- Validate difficulty level
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

-- Create the trigger
DROP TRIGGER IF EXISTS validate_question_trigger ON public.questions;
CREATE TRIGGER validate_question_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION validate_question_content();

-- Create a function to pre-validate questions before insertion
CREATE OR REPLACE FUNCTION pre_validate_question(
  p_text TEXT,
  p_option_a TEXT,
  p_option_b TEXT, 
  p_option_c TEXT,
  p_option_d TEXT,
  p_correct_answer TEXT,
  p_country_id TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  validation_result JSON;
  issues TEXT[] := '{}';
  severity TEXT := 'low';
BEGIN
  -- Check for placeholder patterns
  IF p_text ~* '(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\])' THEN
    issues := array_append(issues, 'CRITICAL: Question contains placeholder text');
    severity := 'critical';
  END IF;

  -- Check options for placeholders
  IF p_option_a ~* '(option a for|incorrect option|placeholder)' OR
     p_option_b ~* '(option b for|incorrect option|placeholder)' OR
     p_option_c ~* '(option c for|incorrect option|placeholder)' OR
     p_option_d ~* '(option d for|incorrect option|placeholder)' THEN
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
