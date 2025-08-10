-- Ensure trigger exists to enforce question content quality on insert/update
DROP TRIGGER IF EXISTS enforce_question_quality ON public.questions;
CREATE TRIGGER enforce_question_quality
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.validate_question_content();

-- Helpful index to speed up duplicate checks by country and text
CREATE INDEX IF NOT EXISTS idx_questions_country_text
ON public.questions (country_id, text);
