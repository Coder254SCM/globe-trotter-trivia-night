
-- FINAL COMPREHENSIVE DELETION: Remove ALL easy questions from database
-- This will permanently delete every question with difficulty = 'easy'

-- Step 1: Count easy questions before deletion (for logging)
DO $$
DECLARE
    easy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO easy_count FROM public.questions WHERE difficulty = 'easy';
    RAISE NOTICE 'Found % easy questions to delete', easy_count;
END $$;

-- Step 2: Delete ALL easy questions in one operation
DELETE FROM public.questions 
WHERE difficulty = 'easy';

-- Step 3: Verify deletion is complete
DO $$
DECLARE
    remaining_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_count FROM public.questions WHERE difficulty = 'easy';
    
    IF remaining_count = 0 THEN
        RAISE NOTICE 'SUCCESS: All easy questions have been deleted';
    ELSE
        RAISE NOTICE 'WARNING: % easy questions still remain', remaining_count;
    END IF;
END $$;

-- Step 4: Show final question count by difficulty
SELECT 
    difficulty, 
    COUNT(*) as question_count 
FROM public.questions 
GROUP BY difficulty 
ORDER BY difficulty;
