// Supabase Edge Function: seed-questions
// Bulk generates and inserts questions using service role (bypasses RLS)
// POST /seed-questions { countryName?: string, difficulty?: 'easy'|'medium'|'hard', limit?: number }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// Embedded country data for question generation
const REAL_COUNTRY_DATA: Record<string, {
  capital: string;
  currency: string;
  language: string;
  continent: string;
  population?: number;
  neighbors?: string[];
  flagColors?: string;
}> = {
  "Argentina": { capital: "Buenos Aires", currency: "Argentine Peso", language: "Spanish", continent: "South America", population: 45810000, neighbors: ["Chile", "Bolivia", "Paraguay", "Brazil", "Uruguay"], flagColors: "Light blue and white horizontal stripes with a golden Sun of May" },
  "Brazil": { capital: "Brasília", currency: "Brazilian Real", language: "Portuguese", continent: "South America", population: 214300000, neighbors: ["Argentina", "Uruguay", "Paraguay", "Bolivia", "Peru", "Colombia", "Venezuela", "Guyana", "Suriname", "French Guiana"], flagColors: "Green background with yellow diamond and blue globe" },
  "Japan": { capital: "Tokyo", currency: "Japanese Yen", language: "Japanese", continent: "Asia", population: 125700000, neighbors: [], flagColors: "White background with red circle (sun)" },
  "France": { capital: "Paris", currency: "Euro", language: "French", continent: "Europe", population: 67750000, neighbors: ["Belgium", "Luxembourg", "Germany", "Switzerland", "Italy", "Monaco", "Spain", "Andorra"], flagColors: "Blue, white, and red vertical stripes" },
  "Germany": { capital: "Berlin", currency: "Euro", language: "German", continent: "Europe", population: 83200000, neighbors: ["Denmark", "Poland", "Czech Republic", "Austria", "Switzerland", "France", "Luxembourg", "Belgium", "Netherlands"], flagColors: "Black, red, and gold horizontal stripes" },
  "United States": { capital: "Washington, D.C.", currency: "US Dollar", language: "English", continent: "North America", population: 331900000, neighbors: ["Canada", "Mexico"], flagColors: "Red and white stripes with blue canton and white stars" },
  "Canada": { capital: "Ottawa", currency: "Canadian Dollar", language: "English, French", continent: "North America", population: 38250000, neighbors: ["United States"], flagColors: "Red and white with red maple leaf" },
  "Australia": { capital: "Canberra", currency: "Australian Dollar", language: "English", continent: "Oceania", population: 25690000, neighbors: [], flagColors: "Blue background with Union Jack and Southern Cross stars" },
  "India": { capital: "New Delhi", currency: "Indian Rupee", language: "Hindi, English", continent: "Asia", population: 1380000000, neighbors: ["Pakistan", "China", "Nepal", "Bhutan", "Bangladesh", "Myanmar"], flagColors: "Saffron, white, and green horizontal stripes with blue Ashoka Chakra" },
  "China": { capital: "Beijing", currency: "Chinese Yuan", language: "Mandarin Chinese", continent: "Asia", population: 1412000000, neighbors: ["Russia", "Mongolia", "North Korea", "Vietnam", "Laos", "Myanmar", "India", "Bhutan", "Nepal", "Pakistan", "Afghanistan", "Tajikistan", "Kyrgyzstan", "Kazakhstan"], flagColors: "Red background with five yellow stars" },
  "United Kingdom": { capital: "London", currency: "British Pound", language: "English", continent: "Europe", population: 67330000, neighbors: ["Ireland"], flagColors: "Union Jack - red, white, and blue crosses" },
  "Italy": { capital: "Rome", currency: "Euro", language: "Italian", continent: "Europe", population: 59110000, neighbors: ["France", "Switzerland", "Austria", "Slovenia", "San Marino", "Vatican City"], flagColors: "Green, white, and red vertical stripes" },
  "Spain": { capital: "Madrid", currency: "Euro", language: "Spanish", continent: "Europe", population: 47420000, neighbors: ["France", "Portugal", "Andorra", "Gibraltar", "Morocco"], flagColors: "Red and yellow horizontal stripes with coat of arms" },
  "Mexico": { capital: "Mexico City", currency: "Mexican Peso", language: "Spanish", continent: "North America", population: 128900000, neighbors: ["United States", "Guatemala", "Belize"], flagColors: "Green, white, and red vertical stripes with eagle emblem" },
  "South Korea": { capital: "Seoul", currency: "South Korean Won", language: "Korean", continent: "Asia", population: 51780000, neighbors: ["North Korea"], flagColors: "White background with red and blue Taeguk and black trigrams" },
  "Russia": { capital: "Moscow", currency: "Russian Ruble", language: "Russian", continent: "Europe/Asia", population: 144100000, neighbors: ["Norway", "Finland", "Estonia", "Latvia", "Lithuania", "Poland", "Belarus", "Ukraine", "Georgia", "Azerbaijan", "Kazakhstan", "China", "Mongolia", "North Korea"], flagColors: "White, blue, and red horizontal stripes" },
  "Egypt": { capital: "Cairo", currency: "Egyptian Pound", language: "Arabic", continent: "Africa", population: 102300000, neighbors: ["Libya", "Sudan", "Israel", "Palestine"], flagColors: "Red, white, and black horizontal stripes with golden eagle" },
  "South Africa": { capital: "Pretoria", currency: "South African Rand", language: "11 official languages including Zulu, Xhosa, English", continent: "Africa", population: 59310000, neighbors: ["Namibia", "Botswana", "Zimbabwe", "Mozambique", "Eswatini", "Lesotho"], flagColors: "Six colors: black, green, yellow, white, red, blue in Y-shape" },
  "Nigeria": { capital: "Abuja", currency: "Nigerian Naira", language: "English", continent: "Africa", population: 206100000, neighbors: ["Benin", "Niger", "Chad", "Cameroon"], flagColors: "Green and white vertical stripes" },
  "Kenya": { capital: "Nairobi", currency: "Kenyan Shilling", language: "Swahili, English", continent: "Africa", population: 53770000, neighbors: ["Ethiopia", "Somalia", "Tanzania", "Uganda", "South Sudan"], flagColors: "Black, red, green stripes with white edges and Maasai shield" },
};

type Difficulty = 'easy' | 'medium' | 'hard';

interface GeneratedQuestion {
  id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  category: string;
  difficulty: Difficulty;
  country_id: string;
  ai_generated: boolean;
}

function generateQuestions(countryName: string, difficulty: Difficulty): GeneratedQuestion[] {
  const data = REAL_COUNTRY_DATA[countryName];
  if (!data) return [];
  
  const countryId = countryName.toLowerCase().replace(/\s+/g, '-');
  const questions: GeneratedQuestion[] = [];
  
  const allCountries = Object.keys(REAL_COUNTRY_DATA);
  const otherCountries = allCountries.filter(c => c !== countryName);
  const shuffle = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);
  
  // Capital question
  const wrongCapitals = shuffle(otherCountries.map(c => REAL_COUNTRY_DATA[c].capital)).slice(0, 3);
  const capitalOptions = shuffle([data.capital, ...wrongCapitals]);
  questions.push({
    id: `${countryId}-capital-${difficulty}-${Date.now()}`,
    text: `What is the capital of ${countryName}?`,
    option_a: capitalOptions[0],
    option_b: capitalOptions[1],
    option_c: capitalOptions[2],
    option_d: capitalOptions[3],
    correct_answer: data.capital,
    explanation: `${data.capital} is the capital city of ${countryName}.`,
    category: 'Geography',
    difficulty,
    country_id: countryId,
    ai_generated: false
  });
  
  // Currency question
  const wrongCurrencies = shuffle(otherCountries.map(c => REAL_COUNTRY_DATA[c].currency)).slice(0, 3);
  const currencyOptions = shuffle([data.currency, ...wrongCurrencies]);
  questions.push({
    id: `${countryId}-currency-${difficulty}-${Date.now()}`,
    text: `What currency is used in ${countryName}?`,
    option_a: currencyOptions[0],
    option_b: currencyOptions[1],
    option_c: currencyOptions[2],
    option_d: currencyOptions[3],
    correct_answer: data.currency,
    explanation: `The official currency of ${countryName} is the ${data.currency}.`,
    category: 'Economy',
    difficulty,
    country_id: countryId,
    ai_generated: false
  });
  
  // Language question
  const wrongLanguages = shuffle(otherCountries.map(c => REAL_COUNTRY_DATA[c].language)).slice(0, 3);
  const langOptions = shuffle([data.language, ...wrongLanguages]);
  questions.push({
    id: `${countryId}-language-${difficulty}-${Date.now()}`,
    text: `What is the primary official language of ${countryName}?`,
    option_a: langOptions[0],
    option_b: langOptions[1],
    option_c: langOptions[2],
    option_d: langOptions[3],
    correct_answer: data.language,
    explanation: `${data.language} is the primary official language of ${countryName}.`,
    category: 'Culture',
    difficulty,
    country_id: countryId,
    ai_generated: false
  });
  
  // Continent question
  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
  const wrongContinents = shuffle(continents.filter(c => c !== data.continent)).slice(0, 3);
  const contOptions = shuffle([data.continent, ...wrongContinents]);
  questions.push({
    id: `${countryId}-continent-${difficulty}-${Date.now()}`,
    text: `On which continent is ${countryName} located?`,
    option_a: contOptions[0],
    option_b: contOptions[1],
    option_c: contOptions[2],
    option_d: contOptions[3],
    correct_answer: data.continent,
    explanation: `${countryName} is located in ${data.continent}.`,
    category: 'Geography',
    difficulty,
    country_id: countryId,
    ai_generated: false
  });
  
  // Flag question (if available)
  if (data.flagColors) {
    const wrongFlags = shuffle(otherCountries.filter(c => REAL_COUNTRY_DATA[c].flagColors).map(c => REAL_COUNTRY_DATA[c].flagColors!)).slice(0, 3);
    const flagOptions = shuffle([data.flagColors, ...wrongFlags]);
    questions.push({
      id: `${countryId}-flag-${difficulty}-${Date.now()}`,
      text: `Which description matches the flag of ${countryName}?`,
      option_a: flagOptions[0],
      option_b: flagOptions[1],
      option_c: flagOptions[2],
      option_d: flagOptions[3],
      correct_answer: data.flagColors,
      explanation: `The flag of ${countryName} features ${data.flagColors.toLowerCase()}.`,
      category: 'Culture',
      difficulty,
      country_id: countryId,
      ai_generated: false
    });
  }
  
  // Neighbor question (if available)
  if (data.neighbors && data.neighbors.length > 0) {
    const neighbor = data.neighbors[0];
    const wrongNeighbors = shuffle(otherCountries.filter(c => !data.neighbors!.includes(c))).slice(0, 3);
    const neighborOptions = shuffle([neighbor, ...wrongNeighbors]);
    questions.push({
      id: `${countryId}-neighbor-${difficulty}-${Date.now()}`,
      text: `Which country shares a border with ${countryName}?`,
      option_a: neighborOptions[0],
      option_b: neighborOptions[1],
      option_c: neighborOptions[2],
      option_d: neighborOptions[3],
      correct_answer: neighbor,
      explanation: `${neighbor} shares a border with ${countryName}.`,
      category: 'Geography',
      difficulty,
      country_id: countryId,
      ai_generated: false
    });
  }
  
  return questions;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
  
  try {
    const body = await req.json().catch(() => ({}));
    const countryName = body.countryName as string | undefined;
    const difficulty = (body.difficulty as Difficulty) || 'easy';
    const limit = body.limit || 100;
    
    const countriesToProcess = countryName 
      ? [countryName] 
      : Object.keys(REAL_COUNTRY_DATA).slice(0, limit);
    
    let totalInserted = 0;
    let totalSkipped = 0;
    const errors: string[] = [];
    
    for (const country of countriesToProcess) {
      const questions = generateQuestions(country, difficulty);
      
      if (questions.length === 0) {
        errors.push(`No data for ${country}`);
        continue;
      }
      
      // Insert questions (upsert to avoid duplicates)
      for (const q of questions) {
        const { error } = await supabase
          .from('questions')
          .upsert(q, { onConflict: 'id' });
        
        if (error) {
          totalSkipped++;
          if (!errors.includes(error.message)) {
            errors.push(`${country}: ${error.message}`);
          }
        } else {
          totalInserted++;
        }
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      inserted: totalInserted,
      skipped: totalSkipped,
      countries: countriesToProcess.length,
      errors: errors.slice(0, 10)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
