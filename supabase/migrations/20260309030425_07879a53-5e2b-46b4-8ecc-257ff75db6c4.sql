
-- Fix RLS: Remove overly permissive policies on questions table
-- Questions should be readable by everyone but only manageable by admins

-- Drop the dangerous open policies
DROP POLICY IF EXISTS "Anyone can delete questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can update questions" ON public.questions;

-- Keep read access for everyone (needed for quiz gameplay)
-- "Anyone can view questions" stays

-- Add proper admin-only write policies
CREATE POLICY "Admins can insert questions"
ON public.questions FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
ON public.questions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
ON public.questions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Also allow anon inserts for the auto-initializer (service role bypasses RLS anyway)
-- But for client-side, only admins should write

-- Fix duplicate policies on failed_questions
DROP POLICY IF EXISTS "Users can create own failed questions" ON public.failed_questions;
DROP POLICY IF EXISTS "Users can view own failed questions" ON public.failed_questions;
-- Keep the properly named ones:
-- "Users can insert their own failed questions" and "Users can view their own failed questions"
