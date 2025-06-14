
-- Simplified approach to completely remove all easy questions
-- This avoids the GROUP BY issue from the previous attempt

-- First, count how many easy questions exist
SELECT COUNT(*) as total_easy_questions 
FROM public.questions 
WHERE difficulty = 'easy';

-- Delete ALL easy questions completely
DELETE FROM public.questions 
WHERE difficulty = 'easy';

-- Also clean up any questions with placeholder text patterns
DELETE FROM public.questions 
WHERE text LIKE '%Medium-level answer for%' 
   OR text LIKE '%Option % for %'
   OR option_a LIKE '%Option % for %'
   OR option_b LIKE '%Option % for %'
   OR option_c LIKE '%Option % for %'
   OR option_d LIKE '%Option % for %';

-- Final verification - should return 0 rows
SELECT COUNT(*) as remaining_easy_questions 
FROM public.questions 
WHERE difficulty = 'easy';

-- Show current question distribution by difficulty
SELECT 
    difficulty, 
    COUNT(*) as question_count,
    COUNT(DISTINCT country_id) as countries_with_questions
FROM public.questions 
GROUP BY difficulty 
ORDER BY difficulty;

-- Show sample of remaining questions to verify quality
SELECT 
    country_id,
    difficulty,
    category,
    LEFT(text, 100) as question_preview
FROM public.questions 
WHERE country_id = 'kenya'
LIMIT 5;
