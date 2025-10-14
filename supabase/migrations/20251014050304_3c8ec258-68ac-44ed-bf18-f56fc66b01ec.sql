
-- Fix the questions RLS policy to allow insertions
DROP POLICY IF EXISTS "Admin full access to questions" ON questions;
DROP POLICY IF EXISTS "Public can view questions" ON questions;

-- Create proper policies that actually work
CREATE POLICY "Anyone can view questions"
ON questions FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert questions"
ON questions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions"
ON questions FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete questions"
ON questions FOR DELETE
TO authenticated
USING (true);
