
-- Enable RLS on questions table (if not already enabled)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to questions
CREATE POLICY "Anyone can view questions" 
  ON public.questions 
  FOR SELECT 
  USING (true);

-- Create policy to allow public insert of questions (for admin functions)
CREATE POLICY "Anyone can insert questions" 
  ON public.questions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow public update of questions (for admin functions)  
CREATE POLICY "Anyone can update questions" 
  ON public.questions 
  FOR UPDATE 
  USING (true);

-- Create policy to allow public delete of questions (for admin functions)
CREATE POLICY "Anyone can delete questions" 
  ON public.questions 
  FOR DELETE 
  USING (true);
