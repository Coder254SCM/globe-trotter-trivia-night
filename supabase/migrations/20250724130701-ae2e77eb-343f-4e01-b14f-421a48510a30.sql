-- Fix remaining functions with search_path issues

CREATE OR REPLACE FUNCTION public.increment_session_players(session_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.multiplayer_sessions 
  SET current_players = current_players + 1 
  WHERE id = session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_session_players(session_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.multiplayer_sessions 
  SET current_players = current_players - 1 
  WHERE id = session_id;
END;
$$;

-- Add the validation trigger to questions table
DROP TRIGGER IF EXISTS validate_question_trigger ON public.questions;
CREATE TRIGGER validate_question_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.validate_question_content();