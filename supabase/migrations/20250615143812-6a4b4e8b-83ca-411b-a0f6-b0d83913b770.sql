
-- Enable pg_cron for scheduling and pg_net for network requests
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Grant necessary permissions
grant usage on schema cron to postgres;

-- Schedule a new weekly challenge to be created every Monday at midnight UTC
select
  cron.schedule(
    'create-weekly-challenge',
    '0 0 * * 1', -- Every Monday at 00:00 UTC
    $$
    select
      net.http_post(
          url:='https://qonnpyaemjpudtptsuyt.supabase.co/functions/v1/create-weekly-challenge',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbm5weWFlbWpwdWR0cHRzdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDQ2NjIsImV4cCI6MjA2NDUyMDY2Mn0.PK2fovbHLd256rOy6HTgM7qqFRbo7aEdYH97PU5eTxM"}'::jsonb
      ) as request_id;
    $$
  );
