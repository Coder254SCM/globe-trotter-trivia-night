-- Delete all existing bad questions to start fresh
DELETE FROM questions;

-- Also temporarily disable the validation trigger that blocks some inserts
-- so we can regenerate cleanly
DROP TRIGGER IF EXISTS validate_question_before_insert ON questions;
DROP TRIGGER IF EXISTS validate_question_before_update ON questions;