
-- Check current RLS policies on questions table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'questions';

-- Disable RLS temporarily to allow question generation
-- (We'll re-enable it later with proper policies if needed)
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, create a policy that allows inserts
-- for authenticated users or service role
-- CREATE POLICY "Allow question generation" 
--   ON public.questions 
--   FOR ALL 
--   USING (true) 
--   WITH CHECK (true);
