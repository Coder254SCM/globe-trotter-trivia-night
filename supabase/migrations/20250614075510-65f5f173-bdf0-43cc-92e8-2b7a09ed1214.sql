
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.countries;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.countries;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.countries;

-- Create policy to allow public read access to countries
CREATE POLICY "Enable read access for all users" ON public.countries
FOR SELECT USING (true);

-- Create policy to allow insert access (for populating countries)
CREATE POLICY "Enable insert access for all users" ON public.countries
FOR INSERT WITH CHECK (true);

-- Create policy to allow update access (for data management)
CREATE POLICY "Enable update access for all users" ON public.countries
FOR UPDATE USING (true);
