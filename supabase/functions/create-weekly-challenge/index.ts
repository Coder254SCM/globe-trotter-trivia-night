
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // The anon key in the Authorization header is used to create a client.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const today = new Date();
    // Set to the beginning of the week (Monday)
    const dayOfWeek = today.getUTCDay();
    const diff = today.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
    const startOfWeek = new Date(today.setUTCDate(diff));
    startOfWeek.setUTCHours(0,0,0,0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setUTCHours(23,59,59,999);

    const startOfWeekISO = startOfWeek.toISOString().split('T')[0];
    const endOfWeekISO = endOfWeek.toISOString().split('T')[0];

    // Check if a challenge for the current week already exists to prevent duplicates
    const { data: existingChallenge, error: existingError } = await supabaseClient
      .from('weekly_challenges')
      .select('id')
      .eq('week_start', startOfWeekISO)
      .single();

    // PGRST116: row not found, which is expected if no challenge exists.
    if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
    }

    if (existingChallenge) {
        return new Response(JSON.stringify({ message: 'Challenge for this week already exists.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    }

    // Fetch 100 hard questions to choose from
    const { data: questions, error: questionsError } = await supabaseClient
      .from('questions')
      .select('id')
      .eq('difficulty', 'hard')
      .limit(100);

    if (questionsError) throw questionsError;

    if (!questions || questions.length < 20) {
      throw new Error('Not enough hard questions available to create a weekly challenge.');
    }

    // Shuffle and select 20 questions for the challenge
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 20);
    const questionIds = selectedQuestions.map(q => q.id);

    // Create the new weekly challenge in the database
    const { data: newChallenge, error: insertError } = await supabaseClient
      .from('weekly_challenges')
      .insert({
        week_start: startOfWeekISO,
        week_end: endOfWeekISO,
        question_ids: questionIds,
        participants: 0
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ message: 'Weekly challenge created successfully.', challenge: newChallenge }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error creating weekly challenge:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```
