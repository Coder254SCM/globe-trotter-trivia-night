import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Identify the caller from their JWT
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userRes.user.id;

    // Admin client (service role) — deletes data + auth user
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Best-effort cleanup of user-owned rows. Order matters for FKs.
    const tables: Array<{ table: string; column: string }> = [
      { table: "player_responses", column: "user_id" },
      { table: "multiplayer_participants", column: "user_id" },
      { table: "room_participants", column: "user_id" },
      { table: "user_challenge_attempts", column: "user_id" },
      { table: "question_votes", column: "user_id" },
      { table: "quality_reports", column: "reported_by" },
      { table: "moderation_actions", column: "moderator_id" },
      { table: "community_questions", column: "submitted_by" },
      { table: "failed_questions", column: "user_id" },
      { table: "friendships", column: "user_id" },
      { table: "friendships", column: "friend_id" },
      { table: "user_achievements", column: "user_id" },
      { table: "quiz_sessions", column: "user_id" },
      { table: "game_sessions_v2", column: "user_id" },
      { table: "leaderboards", column: "user_id" },
      { table: "user_stats", column: "user_id" },
      { table: "user_roles", column: "user_id" },
      { table: "user_profiles", column: "id" },
    ];

    const cleanupErrors: string[] = [];
    for (const { table, column } of tables) {
      const { error } = await admin.from(table).delete().eq(column, userId);
      if (error && !/does not exist|schema cache/i.test(error.message)) {
        cleanupErrors.push(`${table}.${column}: ${error.message}`);
      }
    }

    // Finally remove the auth user
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return new Response(
        JSON.stringify({ error: `Auth delete failed: ${delErr.message}`, cleanupErrors }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true, cleanupErrors }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
