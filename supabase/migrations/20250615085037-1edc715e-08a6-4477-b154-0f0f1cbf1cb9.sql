
-- This will delete all questions from the main `questions` table and any related data.
TRUNCATE TABLE public.questions RESTART IDENTITY CASCADE;

-- This will delete all questions from the `community_questions` table and any related data.
TRUNCATE TABLE public.community_questions RESTART IDENTITY CASCADE;

-- This will clear weekly challenges AND all user attempts for those challenges.
TRUNCATE TABLE public.weekly_challenges RESTART IDENTITY CASCADE;
