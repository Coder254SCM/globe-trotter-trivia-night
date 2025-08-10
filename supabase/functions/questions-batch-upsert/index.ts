// Supabase Edge Function: questions-batch-upsert
// Validates and upserts a batch of questions using the service role to bypass RLS for safe server-side operations
// Endpoint: POST /questions-batch-upsert
// Payload: { questions: Array<DBQuestion>, replaceForCountry?: boolean, countryId?: string }
// Response: { success: boolean, inserted: number, skipped: number, deleted?: number, issues?: any[] }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

type DBQuestion = {
  id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string | null;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  country_id: string | null;
  image_url?: string | null;
  ai_generated?: boolean;
  month_rotation?: number;
};

function fingerprint(q: DBQuestion) {
  const norm = (s?: string | null) => (s || "").toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  const opts = [q.option_a, q.option_b, q.option_c, q.option_d]
    .map(norm)
    .sort()
    .join('|');
  return `${norm(q.text)}::${opts}`;
}

async function preValidate(q: DBQuestion) {
  const { data, error } = await supabase.rpc('pre_validate_question', {
    p_text: q.text,
    p_option_a: q.option_a,
    p_option_b: q.option_b,
    p_option_c: q.option_c,
    p_option_d: q.option_d,
    p_correct_answer: q.correct_answer,
    p_difficulty: q.difficulty,
    p_country_id: q.country_id || null
  });
  if (error) {
    return { isValid: false, issues: [`RPC error: ${error.message}`], severity: 'critical' };
  }
  try {
    const res = typeof data === 'string' ? JSON.parse(data) : data;
    return res;
  } catch {
    return { isValid: false, issues: ['Invalid validation response'], severity: 'critical' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ success: false, error: 'Method Not Allowed' }, 405);
  }

  try {
    const body = await req.json();
    const questions: DBQuestion[] = body?.questions || [];
    const replaceForCountry: boolean = !!body?.replaceForCountry;
    const countryId: string | undefined = body?.countryId;

    if (!Array.isArray(questions) || questions.length === 0) {
      return json({ success: false, error: 'No questions provided' }, 400);
    }

    // Optional replace existing for a country
    let deleted = 0;
    if (replaceForCountry && countryId) {
      const { error: delErr, count } = await supabase
        .from('questions')
        .delete({ count: 'exact' })
        .eq('country_id', countryId);
      if (delErr) {
        // Don't fail the whole request on delete error
        console.warn('Delete error:', delErr);
      }
      deleted = count || 0;
    }

    // Load existing to dedupe
    const countryIds = [...new Set(questions.map(q => q.country_id).filter(Boolean))] as string[];
    const existingByCountry: Record<string, DBQuestion[]> = {};
    for (const cid of countryIds) {
      const { data } = await supabase
        .from('questions')
        .select('id,text,option_a,option_b,option_c,option_d,country_id')
        .eq('country_id', cid)
        .limit(2000);
      existingByCountry[cid] = (data as DBQuestion[]) || [];
    }

    const existingPrints = new Set<string>();
    for (const cid of Object.keys(existingByCountry)) {
      for (const q of existingByCountry[cid]) existingPrints.add(fingerprint(q));
    }

    const toInsert: DBQuestion[] = [];
    const skipped: any[] = [];

    for (const q of questions) {
      // Pre-validate
      const v = await preValidate(q);
      if (!v?.isValid) {
        skipped.push({ id: q.id, reason: 'validation_failed', issues: v?.issues || [] });
        continue;
      }
      // Dedupe
      const fp = fingerprint(q);
      if (existingPrints.has(fp)) {
        skipped.push({ id: q.id, reason: 'duplicate' });
        continue;
      }
      toInsert.push({ ...q, ai_generated: q.ai_generated ?? false, month_rotation: q.month_rotation ?? 1 });
      existingPrints.add(fp);
    }

    let inserted = 0;
    if (toInsert.length > 0) {
      const { error: insErr, count } = await supabase
        .from('questions')
        .insert(toInsert, { count: 'exact' });
      if (insErr) {
        return json({ success: false, error: insErr.message }, 500);
      }
      inserted = count || toInsert.length;
    }

    return json({ success: true, inserted, skipped: skipped.length, deleted, details: { skipped } });
  } catch (e) {
    return json({ success: false, error: (e as Error).message }, 500);
  }
}, { onListen: () => console.log('questions-batch-upsert function running') });

const corsHeaders: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', ...corsHeaders } });
}
