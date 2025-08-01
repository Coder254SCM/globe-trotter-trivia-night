
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
    console.log("AI Proxy function called");
    
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { prompt, model } = requestBody;

    if (!prompt) {
      console.error("No prompt provided");
      return new Response(JSON.stringify({ error: "Prompt is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use the correct secret name from your Supabase secrets
    const apiKey = Deno.env.get("OPEN_ROUTER_MISTRAL_API");
    console.log("API key found:", !!apiKey);
    
    if (!apiKey) {
      console.error("API key not found. Available env vars:", Object.keys(Deno.env.toObject()));
      return new Response(JSON.stringify({ 
        error: "API key missing in Supabase secrets (OPEN_ROUTER_MISTRAL_API)",
        availableVars: Object.keys(Deno.env.toObject())
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prepare the AI API endpoint
    const endpoint = "https://openrouter.ai/api/v1/chat/completions";
    const apiModel = model || "meta-llama/llama-3.1-8b-instruct:free";

    console.log(`Making request to OpenRouter with model: ${apiModel}`);

    const requestPayload = {
      model: apiModel,
      messages: [
        { role: "system", content: "You are a quiz question generator for a geography game. Generate high-quality, factual questions with multiple choice answers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    console.log("Request payload:", JSON.stringify(requestPayload, null, 2));

    const aiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://734fb568-7804-4af1-baf4-655958168ad3.lovableproject.com",
        "X-Title": "Global Quiz Game",
      },
      body: JSON.stringify(requestPayload),
    });

    console.log("OpenRouter response status:", aiResponse.status);
    console.log("OpenRouter response headers:", Object.fromEntries(aiResponse.headers.entries()));

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("OpenRouter API error:", {
        status: aiResponse.status,
        statusText: aiResponse.statusText,
        body: errorText
      });
      
      return new Response(JSON.stringify({ 
        error: `OpenRouter API error: ${aiResponse.status} ${aiResponse.statusText}`,
        details: errorText,
        endpoint: endpoint,
        model: apiModel
      }), {
        status: aiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const respJson = await aiResponse.json();
    console.log("OpenRouter response received successfully");
    console.log("Response structure:", {
      hasChoices: !!respJson.choices,
      choicesLength: respJson.choices?.length,
      firstChoice: respJson.choices?.[0] ? "present" : "missing"
    });
    
    return new Response(JSON.stringify(respJson), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Proxy Error:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Unknown error",
      type: error.name || "UnknownError",
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
