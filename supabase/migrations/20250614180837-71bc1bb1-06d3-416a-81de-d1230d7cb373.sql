
-- Update RLS policies for questions table to restrict direct access
-- Remove the overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can update questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can delete questions" ON public.questions;

-- Keep public read access for quizzes
-- The "Anyone can view questions" policy should remain

-- Add restrictive policies for question management
-- Only allow question insertion through admin/system processes
CREATE POLICY "Only admins can insert questions" 
ON public.questions 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only allow admins to update questions
CREATE POLICY "Only admins can update questions" 
ON public.questions 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only allow admins to delete questions
CREATE POLICY "Only admins can delete questions" 
ON public.questions 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);
