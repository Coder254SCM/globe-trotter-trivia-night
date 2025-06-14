
-- First, check how many easy questions exist
SELECT COUNT(*) as easy_question_count 
FROM public.questions 
WHERE difficulty = 'easy';

-- If there are easy questions, delete them all
DELETE FROM public.questions 
WHERE difficulty = 'easy';

-- Verify deletion worked
SELECT COUNT(*) as remaining_easy_questions 
FROM public.questions 
WHERE difficulty = 'easy';
