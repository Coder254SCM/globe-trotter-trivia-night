
-- Enable RLS on questions_backup table to fix the security warning
ALTER TABLE questions_backup ENABLE ROW LEVEL SECURITY;

-- Add a simple read-only policy for the backup table
CREATE POLICY "Admins can view backups"
ON questions_backup FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
