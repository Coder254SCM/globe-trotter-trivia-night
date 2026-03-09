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

// Maps country display name → DB id
const COUNTRY_ID_MAP: Record<string, string> = {
  "United States": "usa",
  "South Korea": "south-korea",
  "South Africa": "south-africa",
  "United Kingdom": "united-kingdom",
  "North Korea": "north-korea",
  "New Zealand": "new-zealand",
  "Saudi Arabia": "saudi-arabia",
  "Czech Republic": "czech-republic",
  "Bosnia and Herzegovina": "bosnia-herzegovina",
  "Congo (Brazzaville)": "congo-brazzaville",
  "Congo (Kinshasa)": "congo-kinshasa",
};

function countryToId(name: string): string {
  if (COUNTRY_ID_MAP[name]) return COUNTRY_ID_MAP[name];
  return name.toLowerCase().replace(/[\s()&']/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const REAL_COUNTRY_DATA: Record<string, {
  capital: string;
  currency: string;
  language: string;
  continent: string;
  population?: number;
  neighbors?: string[];
  flagColors?: string;
}> = {
  "Afghanistan": { capital: "Kabul", currency: "Afghan Afghani", language: "Dari, Pashto", continent: "Asia", population: 38928000, neighbors: ["Pakistan", "Iran", "Tajikistan", "Turkmenistan", "Uzbekistan", "China"], flagColors: "Black, red, and green vertical stripes with national emblem" },
  "Albania": { capital: "Tirana", currency: "Albanian Lek", language: "Albanian", continent: "Europe", population: 2845000, neighbors: ["Montenegro", "Kosovo", "North Macedonia", "Greece"], flagColors: "Red background with black double-headed eagle" },
  "Algeria": { capital: "Algiers", currency: "Algerian Dinar", language: "Arabic, Tamazight", continent: "Africa", population: 43851000, neighbors: ["Morocco", "Mauritania", "Mali", "Niger", "Libya", "Tunisia"], flagColors: "Green and white vertical halves with red star and crescent" },
  "Angola": { capital: "Luanda", currency: "Angolan Kwanza", language: "Portuguese", continent: "Africa", population: 32866000, neighbors: ["Congo (Kinshasa)", "Zambia", "Namibia"], flagColors: "Red and black horizontal halves with yellow emblem" },
  "Argentina": { capital: "Buenos Aires", currency: "Argentine Peso", language: "Spanish", continent: "South America", population: 45195000, neighbors: ["Chile", "Bolivia", "Paraguay", "Brazil", "Uruguay"], flagColors: "Light blue and white horizontal stripes with golden Sun of May" },
  "Australia": { capital: "Canberra", currency: "Australian Dollar", language: "English", continent: "Oceania", population: 25690000, neighbors: [], flagColors: "Blue background with Union Jack and Southern Cross stars" },
  "Austria": { capital: "Vienna", currency: "Euro", language: "German", continent: "Europe", population: 9006000, neighbors: ["Germany", "Czech Republic", "Slovakia", "Hungary", "Slovenia", "Italy", "Switzerland", "Liechtenstein"], flagColors: "Red, white, and red horizontal stripes" },
  "Bangladesh": { capital: "Dhaka", currency: "Bangladeshi Taka", language: "Bengali", continent: "Asia", population: 164689000, neighbors: ["India", "Myanmar"], flagColors: "Green background with red circle" },
  "Belgium": { capital: "Brussels", currency: "Euro", language: "Dutch, French, German", continent: "Europe", population: 11590000, neighbors: ["Netherlands", "Germany", "Luxembourg", "France"], flagColors: "Black, yellow, and red vertical stripes" },
  "Bolivia": { capital: "Sucre", currency: "Bolivian Boliviano", language: "Spanish", continent: "South America", population: 11673000, neighbors: ["Peru", "Chile", "Argentina", "Paraguay", "Brazil"], flagColors: "Red, yellow, and green horizontal stripes" },
  "Brazil": { capital: "Brasília", currency: "Brazilian Real", language: "Portuguese", continent: "South America", population: 212559000, neighbors: ["Argentina", "Uruguay", "Paraguay", "Bolivia", "Peru", "Colombia", "Venezuela", "Guyana", "Suriname"], flagColors: "Green background with yellow diamond and blue globe" },
  "Canada": { capital: "Ottawa", currency: "Canadian Dollar", language: "English, French", continent: "North America", population: 38005000, neighbors: ["United States"], flagColors: "Red and white with red maple leaf" },
  "Chile": { capital: "Santiago", currency: "Chilean Peso", language: "Spanish", continent: "South America", population: 19116000, neighbors: ["Peru", "Bolivia", "Argentina"], flagColors: "Red, white, blue stripes with white star on blue canton" },
  "China": { capital: "Beijing", currency: "Chinese Yuan", language: "Mandarin Chinese", continent: "Asia", population: 1412000000, neighbors: ["Russia", "Mongolia", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Afghanistan", "Pakistan", "India", "Nepal", "Bhutan", "Myanmar", "Laos", "Vietnam", "North Korea"], flagColors: "Red background with five yellow stars" },
  "Colombia": { capital: "Bogotá", currency: "Colombian Peso", language: "Spanish", continent: "South America", population: 50882000, neighbors: ["Venezuela", "Brazil", "Peru", "Ecuador", "Panama"], flagColors: "Yellow, blue, and red horizontal stripes" },
  "Czech Republic": { capital: "Prague", currency: "Czech Koruna", language: "Czech", continent: "Europe", population: 10724000, neighbors: ["Germany", "Austria", "Slovakia", "Poland"], flagColors: "White and red horizontal halves with blue triangle on left" },
  "Denmark": { capital: "Copenhagen", currency: "Danish Krone", language: "Danish", continent: "Europe", population: 5831000, neighbors: ["Germany"], flagColors: "Red background with white Nordic cross" },
  "Egypt": { capital: "Cairo", currency: "Egyptian Pound", language: "Arabic", continent: "Africa", population: 102334000, neighbors: ["Libya", "Sudan", "Israel"], flagColors: "Red, white, and black horizontal stripes with golden eagle" },
  "Ethiopia": { capital: "Addis Ababa", currency: "Ethiopian Birr", language: "Amharic", continent: "Africa", population: 114964000, neighbors: ["Eritrea", "Djibouti", "Somalia", "Kenya", "South Sudan", "Sudan"], flagColors: "Green, yellow, and red horizontal stripes with blue circle and star" },
  "Finland": { capital: "Helsinki", currency: "Euro", language: "Finnish, Swedish", continent: "Europe", population: 5541000, neighbors: ["Norway", "Sweden", "Russia"], flagColors: "White background with blue Nordic cross" },
  "France": { capital: "Paris", currency: "Euro", language: "French", continent: "Europe", population: 67391000, neighbors: ["Belgium", "Luxembourg", "Germany", "Switzerland", "Italy", "Monaco", "Spain", "Andorra"], flagColors: "Blue, white, and red vertical stripes" },
  "Germany": { capital: "Berlin", currency: "Euro", language: "German", continent: "Europe", population: 83240000, neighbors: ["Denmark", "Poland", "Czech Republic", "Austria", "Switzerland", "France", "Luxembourg", "Belgium", "Netherlands"], flagColors: "Black, red, and gold horizontal stripes" },
  "Ghana": { capital: "Accra", currency: "Ghanaian Cedi", language: "English", continent: "Africa", population: 31073000, neighbors: ["Burkina Faso", "Togo", "Ivory Coast"], flagColors: "Red, gold, and green horizontal stripes with black star" },
  "Greece": { capital: "Athens", currency: "Euro", language: "Greek", continent: "Europe", population: 10423000, neighbors: ["Albania", "North Macedonia", "Bulgaria", "Turkey"], flagColors: "Blue and white horizontal stripes with blue canton and white cross" },
  "Hungary": { capital: "Budapest", currency: "Hungarian Forint", language: "Hungarian", continent: "Europe", population: 9773000, neighbors: ["Slovakia", "Ukraine", "Romania", "Serbia", "Croatia", "Slovenia", "Austria"], flagColors: "Red, white, and green horizontal stripes" },
  "India": { capital: "New Delhi", currency: "Indian Rupee", language: "Hindi, English", continent: "Asia", population: 1380004000, neighbors: ["Pakistan", "China", "Nepal", "Bhutan", "Bangladesh", "Myanmar"], flagColors: "Saffron, white, and green horizontal stripes with blue Ashoka Chakra" },
  "Indonesia": { capital: "Jakarta", currency: "Indonesian Rupiah", language: "Indonesian", continent: "Asia", population: 273524000, neighbors: ["Papua New Guinea", "Malaysia", "Timor-Leste"], flagColors: "Red and white horizontal halves" },
  "Iran": { capital: "Tehran", currency: "Iranian Rial", language: "Persian", continent: "Asia", population: 83993000, neighbors: ["Iraq", "Turkey", "Armenia", "Azerbaijan", "Turkmenistan", "Afghanistan", "Pakistan"], flagColors: "Green, white, and red horizontal stripes with emblem and script" },
  "Iraq": { capital: "Baghdad", currency: "Iraqi Dinar", language: "Arabic, Kurdish", continent: "Asia", population: 40222000, neighbors: ["Turkey", "Iran", "Kuwait", "Saudi Arabia", "Jordan", "Syria"], flagColors: "Red, white, and black horizontal stripes with green Arabic script" },
  "Ireland": { capital: "Dublin", currency: "Euro", language: "Irish, English", continent: "Europe", population: 4994000, neighbors: ["United Kingdom"], flagColors: "Green, white, and orange vertical stripes" },
  "Israel": { capital: "Jerusalem", currency: "Israeli New Shekel", language: "Hebrew, Arabic", continent: "Asia", population: 8655000, neighbors: ["Lebanon", "Syria", "Jordan", "Egypt"], flagColors: "White with two blue horizontal stripes and Star of David" },
  "Italy": { capital: "Rome", currency: "Euro", language: "Italian", continent: "Europe", population: 60462000, neighbors: ["France", "Switzerland", "Austria", "Slovenia", "San Marino", "Vatican City"], flagColors: "Green, white, and red vertical stripes" },
  "Japan": { capital: "Tokyo", currency: "Japanese Yen", language: "Japanese", continent: "Asia", population: 125836000, neighbors: [], flagColors: "White background with red circle representing the sun" },
  "Kenya": { capital: "Nairobi", currency: "Kenyan Shilling", language: "Swahili, English", continent: "Africa", population: 53771000, neighbors: ["Ethiopia", "Somalia", "Tanzania", "Uganda", "South Sudan"], flagColors: "Black, red, and green horizontal stripes with Maasai shield" },
  "Malaysia": { capital: "Kuala Lumpur", currency: "Malaysian Ringgit", language: "Malay", continent: "Asia", population: 32366000, neighbors: ["Thailand", "Brunei", "Indonesia"], flagColors: "Red and white horizontal stripes with blue canton, crescent and star" },
  "Mexico": { capital: "Mexico City", currency: "Mexican Peso", language: "Spanish", continent: "North America", population: 128933000, neighbors: ["United States", "Guatemala", "Belize"], flagColors: "Green, white, and red vertical stripes with eagle emblem" },
  "Morocco": { capital: "Rabat", currency: "Moroccan Dirham", language: "Arabic, Tamazight", continent: "Africa", population: 36911000, neighbors: ["Algeria", "Mauritania"], flagColors: "Red background with green pentagram star" },
  "Netherlands": { capital: "Amsterdam", currency: "Euro", language: "Dutch", continent: "Europe", population: 17441000, neighbors: ["Belgium", "Germany"], flagColors: "Red, white, and blue horizontal stripes" },
  "New Zealand": { capital: "Wellington", currency: "New Zealand Dollar", language: "English, Māori", continent: "Oceania", population: 5084000, neighbors: [], flagColors: "Blue background with Union Jack and Southern Cross" },
  "Nigeria": { capital: "Abuja", currency: "Nigerian Naira", language: "English", continent: "Africa", population: 206139000, neighbors: ["Benin", "Niger", "Chad", "Cameroon"], flagColors: "Green and white vertical stripes" },
  "North Korea": { capital: "Pyongyang", currency: "North Korean Won", language: "Korean", continent: "Asia", population: 25779000, neighbors: ["China", "Russia", "South Korea"], flagColors: "Blue, white, red stripes with white circle and red star" },
  "Norway": { capital: "Oslo", currency: "Norwegian Krone", language: "Norwegian", continent: "Europe", population: 5421000, neighbors: ["Sweden", "Finland", "Russia"], flagColors: "Red background with blue and white Nordic cross" },
  "Pakistan": { capital: "Islamabad", currency: "Pakistani Rupee", language: "Urdu, English", continent: "Asia", population: 220892000, neighbors: ["India", "China", "Afghanistan", "Iran"], flagColors: "Dark green with white crescent and star, white stripe on left" },
  "Peru": { capital: "Lima", currency: "Peruvian Sol", language: "Spanish", continent: "South America", population: 32972000, neighbors: ["Ecuador", "Colombia", "Brazil", "Bolivia", "Chile"], flagColors: "Red, white, and red vertical stripes with coat of arms" },
  "Philippines": { capital: "Manila", currency: "Philippine Peso", language: "Filipino, English", continent: "Asia", population: 109581000, neighbors: [], flagColors: "Blue, red, and white with yellow sun and three stars" },
  "Poland": { capital: "Warsaw", currency: "Polish Zloty", language: "Polish", continent: "Europe", population: 37950000, neighbors: ["Russia", "Lithuania", "Belarus", "Ukraine", "Slovakia", "Czech Republic", "Germany"], flagColors: "White and red horizontal halves" },
  "Portugal": { capital: "Lisbon", currency: "Euro", language: "Portuguese", continent: "Europe", population: 10196000, neighbors: ["Spain"], flagColors: "Green and red vertical halves with coat of arms" },
  "Romania": { capital: "Bucharest", currency: "Romanian Leu", language: "Romanian", continent: "Europe", population: 19238000, neighbors: ["Ukraine", "Moldova", "Bulgaria", "Serbia", "Hungary"], flagColors: "Blue, yellow, and red vertical stripes" },
  "Russia": { capital: "Moscow", currency: "Russian Ruble", language: "Russian", continent: "Europe", population: 145934000, neighbors: ["Norway", "Finland", "Estonia", "Latvia", "Lithuania", "Poland", "Belarus", "Ukraine", "Georgia", "Azerbaijan", "Kazakhstan", "China", "Mongolia", "North Korea"], flagColors: "White, blue, and red horizontal stripes" },
  "Saudi Arabia": { capital: "Riyadh", currency: "Saudi Riyal", language: "Arabic", continent: "Asia", population: 34814000, neighbors: ["Jordan", "Iraq", "Kuwait", "Bahrain", "Qatar", "UAE", "Oman", "Yemen"], flagColors: "Green background with white Arabic text and sword" },
  "South Africa": { capital: "Pretoria", currency: "South African Rand", language: "Zulu, Xhosa, Afrikaans, English", continent: "Africa", population: 59308000, neighbors: ["Namibia", "Botswana", "Zimbabwe", "Mozambique", "Eswatini", "Lesotho"], flagColors: "Black, green, yellow, white, red, and blue in Y-shape pattern" },
  "South Korea": { capital: "Seoul", currency: "South Korean Won", language: "Korean", continent: "Asia", population: 51269000, neighbors: ["North Korea"], flagColors: "White background with red and blue Taeguk and black trigrams" },
  "Spain": { capital: "Madrid", currency: "Euro", language: "Spanish", continent: "Europe", population: 47351000, neighbors: ["France", "Portugal", "Andorra", "Morocco"], flagColors: "Red and yellow horizontal stripes with coat of arms" },
  "Sweden": { capital: "Stockholm", currency: "Swedish Krona", language: "Swedish", continent: "Europe", population: 10353000, neighbors: ["Norway", "Finland"], flagColors: "Blue background with yellow Nordic cross" },
  "Switzerland": { capital: "Bern", currency: "Swiss Franc", language: "German, French, Italian, Romansh", continent: "Europe", population: 8654000, neighbors: ["Germany", "Austria", "Liechtenstein", "Italy", "France"], flagColors: "Red background with white cross" },
  "Tanzania": { capital: "Dodoma", currency: "Tanzanian Shilling", language: "Swahili, English", continent: "Africa", population: 59734000, neighbors: ["Kenya", "Uganda", "Rwanda", "Burundi", "Congo (Kinshasa)", "Zambia", "Malawi", "Mozambique"], flagColors: "Green, yellow, black diagonal stripe on blue background" },
  "Thailand": { capital: "Bangkok", currency: "Thai Baht", language: "Thai", continent: "Asia", population: 69800000, neighbors: ["Myanmar", "Laos", "Cambodia", "Malaysia"], flagColors: "Red, white, blue, white, red horizontal stripes" },
  "Turkey": { capital: "Ankara", currency: "Turkish Lira", language: "Turkish", continent: "Asia/Europe", population: 84339000, neighbors: ["Greece", "Bulgaria", "Georgia", "Armenia", "Azerbaijan", "Iran", "Iraq", "Syria"], flagColors: "Red background with white crescent and star" },
  "Ukraine": { capital: "Kyiv", currency: "Ukrainian Hryvnia", language: "Ukrainian", continent: "Europe", population: 43734000, neighbors: ["Russia", "Belarus", "Poland", "Slovakia", "Hungary", "Romania", "Moldova"], flagColors: "Blue and yellow horizontal halves" },
  "United Kingdom": { capital: "London", currency: "British Pound", language: "English", continent: "Europe", population: 67886000, neighbors: ["Ireland"], flagColors: "Union Jack combining red and white crosses on blue" },
  "United States": { capital: "Washington, D.C.", currency: "US Dollar", language: "English", continent: "North America", population: 331002000, neighbors: ["Canada", "Mexico"], flagColors: "Red and white stripes with blue canton and white stars" },
  "Venezuela": { capital: "Caracas", currency: "Venezuelan Bolívar", language: "Spanish", continent: "South America", population: 28436000, neighbors: ["Colombia", "Brazil", "Guyana"], flagColors: "Yellow, blue, and red horizontal stripes with stars and emblem" },
  "Vietnam": { capital: "Hanoi", currency: "Vietnamese Dong", language: "Vietnamese", continent: "Asia", population: 97339000, neighbors: ["China", "Laos", "Cambodia"], flagColors: "Red background with yellow five-pointed star" },
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

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

function makeOptions(correct: string, wrongs: string[]): [string, string, string, string] {
  // Deduplicate and ensure distinct options
  const uniqueWrongs = [...new Set(wrongs.filter(w => w !== correct))].slice(0, 3);
  while (uniqueWrongs.length < 3) uniqueWrongs.push(`Other (${uniqueWrongs.length})`);
  const opts = shuffle([correct, ...uniqueWrongs]) as [string, string, string, string];
  return opts;
}

function generateQuestionsForCountry(countryName: string, difficulty: Difficulty): GeneratedQuestion[] {
  const data = REAL_COUNTRY_DATA[countryName];
  if (!data) return [];

  const countryId = countryToId(countryName);
  const questions: GeneratedQuestion[] = [];
  const ts = Date.now();
  const allCountries = Object.keys(REAL_COUNTRY_DATA);
  const others = allCountries.filter(c => c !== countryName);

  // Capital
  const [ca, cb, cc, cd] = makeOptions(data.capital, shuffle(others).slice(0, 5).map(c => REAL_COUNTRY_DATA[c].capital));
  questions.push({ id: `${countryId}-cap-${difficulty}-${ts}`, text: `What is the capital city of ${countryName}?`, option_a: ca, option_b: cb, option_c: cc, option_d: cd, correct_answer: data.capital, explanation: `${data.capital} is the capital of ${countryName}.`, category: 'Geography', difficulty, country_id: countryId, ai_generated: false });

  // Currency
  const [cua, cub, cuc, cud] = makeOptions(data.currency, shuffle(others).slice(0, 5).map(c => REAL_COUNTRY_DATA[c].currency));
  questions.push({ id: `${countryId}-cur-${difficulty}-${ts}`, text: `What is the official currency of ${countryName}?`, option_a: cua, option_b: cub, option_c: cuc, option_d: cud, correct_answer: data.currency, explanation: `${countryName} uses the ${data.currency}.`, category: 'Economy', difficulty, country_id: countryId, ai_generated: false });

  // Language
  const [la, lb, lc, ld] = makeOptions(data.language, shuffle(others).slice(0, 5).map(c => REAL_COUNTRY_DATA[c].language));
  questions.push({ id: `${countryId}-lang-${difficulty}-${ts}`, text: `What is the primary official language spoken in ${countryName}?`, option_a: la, option_b: lb, option_c: lc, option_d: ld, correct_answer: data.language, explanation: `${data.language} is the primary official language of ${countryName}.`, category: 'Culture', difficulty, country_id: countryId, ai_generated: false });

  // Continent
  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'];
  const [coa, cob, coc, cod] = makeOptions(data.continent, shuffle(continents.filter(c => c !== data.continent)).slice(0, 3));
  questions.push({ id: `${countryId}-cont-${difficulty}-${ts}`, text: `On which continent is ${countryName} located?`, option_a: coa, option_b: cob, option_c: coc, option_d: cod, correct_answer: data.continent, explanation: `${countryName} is in ${data.continent}.`, category: 'Geography', difficulty, country_id: countryId, ai_generated: false });

  // Flag
  if (data.flagColors) {
    const flagWrongs = shuffle(others.filter(c => REAL_COUNTRY_DATA[c].flagColors && REAL_COUNTRY_DATA[c].flagColors !== data.flagColors)).slice(0, 5).map(c => REAL_COUNTRY_DATA[c].flagColors!);
    const [fa, fb, fc, fd] = makeOptions(data.flagColors, flagWrongs);
    questions.push({ id: `${countryId}-flag-${difficulty}-${ts}`, text: `Which description best matches the flag of ${countryName}?`, option_a: fa, option_b: fb, option_c: fc, option_d: fd, correct_answer: data.flagColors, explanation: `The flag of ${countryName}: ${data.flagColors}.`, category: 'Culture', difficulty, country_id: countryId, ai_generated: false });
  }

  // Neighbor
  if (data.neighbors && data.neighbors.length > 0) {
    const neighbor = data.neighbors[0];
    const nonNeighbors = shuffle(others.filter(c => !data.neighbors!.includes(c))).slice(0, 5);
    const [na, nb, nc, nd] = makeOptions(neighbor, nonNeighbors);
    questions.push({ id: `${countryId}-nbr-${difficulty}-${ts}`, text: `Which of these countries shares a border with ${countryName}?`, option_a: na, option_b: nb, option_c: nc, option_d: nd, correct_answer: neighbor, explanation: `${neighbor} borders ${countryName}.`, category: 'Geography', difficulty, country_id: countryId, ai_generated: false });
  }

  // Population (medium/hard)
  if ((difficulty === 'medium' || difficulty === 'hard') && data.population) {
    const pop = data.population;
    const ranges = [
      { label: "Under 1 million", min: 0, max: 1_000_000 },
      { label: "1–10 million", min: 1_000_000, max: 10_000_000 },
      { label: "10–50 million", min: 10_000_000, max: 50_000_000 },
      { label: "50–200 million", min: 50_000_000, max: 200_000_000 },
      { label: "Over 200 million", min: 200_000_000, max: Infinity },
    ];
    const correctRange = ranges.find(r => pop >= r.min && pop < r.max)!;
    if (correctRange) {
      const wrongRanges = ranges.filter(r => r.label !== correctRange.label).map(r => r.label);
      const [pa, pb, pc, pd] = makeOptions(correctRange.label, wrongRanges);
      questions.push({ id: `${countryId}-pop-${difficulty}-${ts}`, text: `What is the approximate population range of ${countryName}?`, option_a: pa, option_b: pb, option_c: pc, option_d: pd, correct_answer: correctRange.label, explanation: `${countryName} has a population of approximately ${(pop / 1_000_000).toFixed(1)} million, placing it in the "${correctRange.label}" range.`, category: 'Demographics', difficulty, country_id: countryId, ai_generated: false });
    }
  }

  // Neighbor count (hard)
  if (difficulty === 'hard' && data.neighbors !== undefined) {
    const count = data.neighbors.length;
    const label = count === 0 ? 'Island nation with no land borders' : count === 1 ? '1 country' : `${count} countries`;
    const opts = ['Island nation with no land borders', '1 country', '3–4 countries', '5–7 countries', '10 or more countries'];
    const correctOpt = count === 0 ? opts[0] : count === 1 ? opts[1] : count <= 4 ? opts[2] : count <= 7 ? opts[3] : opts[4];
    const wrongOpts = opts.filter(o => o !== correctOpt);
    const [hna, hnb, hnc, hnd] = makeOptions(correctOpt, wrongOpts);
    questions.push({ id: `${countryId}-nbrcount-${difficulty}-${ts}`, text: `How many countries share a land border with ${countryName}?`, option_a: hna, option_b: hnb, option_c: hnc, option_d: hnd, correct_answer: correctOpt, explanation: `${countryName} borders ${label}.`, category: 'Geography', difficulty, country_id: countryId, ai_generated: false });
  }

  return questions;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json().catch(() => ({}));
    const countryName = body.countryName as string | undefined;
    const difficulties: Difficulty[] = body.difficulty ? [body.difficulty] : ['easy', 'medium', 'hard'];
    const limit = body.limit || Object.keys(REAL_COUNTRY_DATA).length;

    const countriesToProcess = countryName
      ? [countryName]
      : Object.keys(REAL_COUNTRY_DATA).slice(0, limit);

    let totalInserted = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    for (const country of countriesToProcess) {
      for (const diff of difficulties) {
        const questions = generateQuestionsForCountry(country, diff);

        if (questions.length === 0) {
          if (!errors.includes(`No data for ${country}`)) errors.push(`No data for ${country}`);
          continue;
        }

        for (const q of questions) {
          const { error } = await supabase.from('questions').upsert(q, { onConflict: 'id' });
          if (error) {
            totalSkipped++;
            const msg = `${country}/${diff}: ${error.message}`;
            if (!errors.includes(msg)) errors.push(msg);
          } else {
            totalInserted++;
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, skipped: totalSkipped, countries: countriesToProcess.length, difficulties, errors: errors.slice(0, 15) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
