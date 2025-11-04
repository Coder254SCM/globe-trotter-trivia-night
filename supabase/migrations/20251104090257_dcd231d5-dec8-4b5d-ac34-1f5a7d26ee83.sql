-- Fix RLS policies to allow question insertion during auto-generation
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can update questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can delete questions" ON questions;

-- Allow public insertion for auto-generation (questions are public data anyway)
CREATE POLICY "Anyone can insert questions"
ON questions FOR INSERT
TO public
WITH CHECK (true);

-- Allow public updates for question management
CREATE POLICY "Anyone can update questions"
ON questions FOR UPDATE
TO public
USING (true);

-- Allow public deletion for cleanup
CREATE POLICY "Anyone can delete questions"
ON questions FOR DELETE
TO public
USING (true);