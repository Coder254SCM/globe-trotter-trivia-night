
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Set correct CORS headers for browser
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get API key from Supabase secrets (OPENROUTER_API_KEY or OPENAI_API_KEY, adjust as needed)
    const apiKey = Deno.env.get("OPENROUTER_API_KEY"); // Or "OPENAI_API_KEY" if using OpenAI
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key missing in Supabase secrets" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prepare the AI API endpoint (adjust URL and headers for your model/provider)
    const endpoint = "https://openrouter.ai/api/v1/chat/completions";
    const apiModel = model || "meta-llama/llama-3.1-8b-instruct:free";

    const aiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-app-url.com", // Optional, adjust if needed
        "X-Title": "Global Quiz Game",
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          { role: "system", content: "You are a quiz question generator for a geography game." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.json();
      return new Response(JSON.stringify({ error: err?.error?.message || "Error from AI API" }), {
        status: aiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const respJson = await aiResponse.json();
    // Optionally, post-process, filter, or validate respJson here.
    return new Response(JSON.stringify(respJson), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Proxy Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
