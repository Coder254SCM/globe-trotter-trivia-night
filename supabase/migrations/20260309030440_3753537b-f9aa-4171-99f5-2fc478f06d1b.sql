
-- Fix overly permissive RLS on countries table
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.countries;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.countries;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.countries;

-- Keep both SELECT policies (they're fine for public read)
-- Add admin-only write policies
CREATE POLICY "Admins can insert countries"
ON public.countries FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update countries"
ON public.countries FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete countries"
ON public.countries FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
