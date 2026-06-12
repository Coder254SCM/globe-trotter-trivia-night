-- Remove any previous schedule with the same name
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'weekly-seed-questions';

SELECT cron.schedule(
  'weekly-seed-questions',
  '0 3 * * 1', -- every Monday at 03:00 UTC
  $$
  SELECT net.http_post(
    url := 'https://qonnpyaemjpudtptsuyt.supabase.co/functions/v1/seed-questions',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbm5weWFlbWpwdWR0cHRzdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDQ2NjIsImV4cCI6MjA2NDUyMDY2Mn0.PK2fovbHLd256rOy6HTgM7qqFRbo7aEdYH97PU5eTxM","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbm5weWFlbWpwdWR0cHRzdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDQ2NjIsImV4cCI6MjA2NDUyMDY2Mn0.PK2fovbHLd256rOy6HTgM7qqFRbo7aEdYH97PU5eTxM"}'::jsonb,
    body := jsonb_build_object('triggered_at', now(), 'source', 'pg_cron_weekly')
  ) AS request_id;
  $$
);