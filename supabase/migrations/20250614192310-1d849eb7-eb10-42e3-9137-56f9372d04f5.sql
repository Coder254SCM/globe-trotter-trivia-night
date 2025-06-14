
-- Comprehensive deletion of all easy questions with detailed logging
-- This will permanently remove every question with difficulty = 'easy'

-- First, let's see exactly what we're dealing with
SELECT 
    difficulty,
    COUNT(*) as question_count,
    COUNT(DISTINCT country_id) as countries_affected
FROM public.questions 
GROUP BY difficulty 
ORDER BY difficulty;

-- Show some sample easy questions to understand the data
SELECT 
    id,
    country_id,
    difficulty,
    LEFT(text, 100) as question_preview
FROM public.questions 
WHERE difficulty = 'easy'
LIMIT 10;

-- Now delete ALL easy questions in one comprehensive operation
DELETE FROM public.questions 
WHERE difficulty = 'easy';

-- Also delete any questions that might have variations of 'easy'
DELETE FROM public.questions 
WHERE LOWER(TRIM(difficulty)) IN ('easy', 'beginner', 'simple', 'basic');

-- Delete any questions with placeholder text that might be corrupted
DELETE FROM public.questions 
WHERE text ILIKE '%easy%question%' 
   OR text ILIKE '%placeholder%'
   OR text ILIKE '%template%'
   OR option_a ILIKE '%placeholder%'
   OR option_b ILIKE '%placeholder%'
   OR option_c ILIKE '%placeholder%'
   OR option_d ILIKE '%placeholder%';

-- Final verification - this should show 0 easy questions
SELECT COUNT(*) as remaining_easy_questions 
FROM public.questions 
WHERE difficulty = 'easy';

-- Show final distribution by difficulty
SELECT 
    difficulty,
    COUNT(*) as question_count,
    COUNT(DISTINCT country_id) as countries_with_questions
FROM public.questions 
GROUP BY difficulty 
ORDER BY difficulty;

-- Update any questions that might have NULL or invalid difficulties
UPDATE public.questions 
SET difficulty = 'medium' 
WHERE difficulty IS NULL 
   OR difficulty NOT IN ('medium', 'hard');
