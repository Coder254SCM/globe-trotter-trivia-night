
-- Enhanced easy question deletion with multiple passes and verification
-- This migration ensures complete removal of all easy questions

-- First, check how many easy questions exist
SELECT COUNT(*) as easy_question_count 
FROM public.questions 
WHERE difficulty = 'easy';

-- Delete all easy questions in multiple passes to ensure complete removal
DO $$
DECLARE
    deleted_count INTEGER;
    total_deleted INTEGER := 0;
    pass_number INTEGER := 1;
    remaining_count INTEGER;
BEGIN
    -- Loop until no more easy questions exist
    LOOP
        -- Delete a batch of easy questions
        DELETE FROM public.questions 
        WHERE difficulty = 'easy' 
        AND id IN (
            SELECT id FROM public.questions 
            WHERE difficulty = 'easy' 
            LIMIT 1000
        );
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        total_deleted := total_deleted + deleted_count;
        
        RAISE NOTICE 'Pass %: Deleted % easy questions (Total deleted: %)', 
                     pass_number, deleted_count, total_deleted;
        
        -- Check if any easy questions remain
        SELECT COUNT(*) INTO remaining_count 
        FROM public.questions 
        WHERE difficulty = 'easy';
        
        -- Exit if no more easy questions or no deletions in this pass
        EXIT WHEN remaining_count = 0 OR deleted_count = 0;
        
        pass_number := pass_number + 1;
        
        -- Safety check to prevent infinite loop
        EXIT WHEN pass_number > 10;
    END LOOP;
    
    RAISE NOTICE 'Deletion complete after % passes. Total deleted: %', 
                 pass_number - 1, total_deleted;
END $$;

-- Final verification - this should return 0
SELECT COUNT(*) as remaining_easy_questions 
FROM public.questions 
WHERE difficulty = 'easy';

-- Also ensure no questions have variations of 'easy' difficulty
UPDATE public.questions 
SET difficulty = 'medium' 
WHERE LOWER(TRIM(difficulty)) IN ('easy', 'beginner', 'simple', 'basic')
AND difficulty != 'easy';

-- Final count of all questions by difficulty
SELECT difficulty, COUNT(*) as count 
FROM public.questions 
GROUP BY difficulty 
ORDER BY difficulty;
