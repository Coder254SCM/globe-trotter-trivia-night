/**
 * Generates high-quality, factually accurate quiz questions using real country data.
 * This replaces the old broken template generator.
 */

import { Question } from "@/types/quiz";
import { REAL_COUNTRY_DATA, CountryFactData } from "@/data/realCountryData";

interface CountryInput {
  id: string;
  name: string;
  continent: string;
  capital?: string | null;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude ? arr.filter(a => a !== exclude) : [...arr];
  return shuffleArray(filtered).slice(0, count);
}

// Pool of wrong answers by type
const CAPITAL_POOL = ["Tokyo", "Paris", "London", "Berlin", "Madrid", "Rome", "Ottawa", "Canberra", "Brasília", "Moscow", "Beijing", "New Delhi", "Cairo", "Nairobi", "Lima", "Bangkok", "Seoul", "Ankara", "Vienna", "Warsaw", "Lisbon", "Athens", "Budapest", "Prague", "Stockholm", "Oslo", "Helsinki", "Copenhagen", "Dublin", "Brussels", "Amsterdam", "Bern", "Riyadh", "Doha", "Hanoi", "Manila", "Jakarta", "Kuala Lumpur", "Singapore", "Accra", "Addis Ababa", "Dakar"];
const CURRENCY_POOL = ["US Dollar", "Euro", "British Pound", "Japanese Yen", "Chinese Yuan", "Indian Rupee", "Australian Dollar", "Canadian Dollar", "Swiss Franc", "Brazilian Real", "South Korean Won", "Mexican Peso", "Russian Ruble", "Turkish Lira", "South African Rand", "Nigerian Naira", "Egyptian Pound", "Thai Baht", "Vietnamese Dong", "Philippine Peso"];
const LANGUAGE_POOL = ["English", "Spanish", "French", "Portuguese", "Arabic", "Mandarin Chinese", "Hindi", "Russian", "German", "Japanese", "Korean", "Italian", "Dutch", "Swedish", "Polish", "Turkish", "Swahili", "Bengali", "Vietnamese", "Thai"];
const CONTINENT_POOL = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
const DISH_POOL = ["Sushi", "Pizza", "Tacos", "Biryani", "Paella", "Pho", "Dim Sum", "Kebab", "Feijoada", "Pad Thai", "Croissant", "Borscht", "Pierogi", "Couscous", "Jollof Rice", "Empanadas", "Ramen", "Fish and Chips", "Hamburger", "Poutine"];
const LANDMARK_POOL = ["Eiffel Tower", "Great Wall of China", "Taj Mahal", "Colosseum", "Machu Picchu", "Statue of Liberty", "Big Ben", "Sydney Opera House", "Christ the Redeemer", "Pyramids of Giza", "Angkor Wat", "Petra", "Hagia Sophia", "Mount Fuji", "Sagrada Família", "Acropolis", "Chichen Itza", "Brandenburg Gate", "Table Mountain", "Blue Lagoon"];

type QuestionTemplate = (country: CountryInput, data: CountryFactData) => { text: string; correct: string; wrong: string[]; category: string; explanation: string } | null;

const EASY_TEMPLATES: QuestionTemplate[] = [
  (c, d) => ({
    text: `What is the capital of ${c.name}?`,
    correct: d.capital,
    wrong: pickRandom(CAPITAL_POOL, 3, d.capital),
    category: "geography",
    explanation: `The capital of ${c.name} is ${d.capital}.`
  }),
  (c, d) => ({
    text: `On which continent is ${c.name} located?`,
    correct: c.continent,
    wrong: pickRandom(CONTINENT_POOL, 3, c.continent),
    category: "geography",
    explanation: `${c.name} is located in ${c.continent}.`
  }),
  (c, d) => ({
    text: `What currency is used in ${c.name}?`,
    correct: d.currency,
    wrong: pickRandom(CURRENCY_POOL, 3, d.currency),
    category: "culture",
    explanation: `The currency of ${c.name} is the ${d.currency}.`
  }),
  (c, d) => ({
    text: `What is the primary language spoken in ${c.name}?`,
    correct: d.language,
    wrong: pickRandom(LANGUAGE_POOL, 3, d.language),
    category: "culture",
    explanation: `${d.language} is the primary language spoken in ${c.name}.`
  }),
  (c, d) => ({
    text: `What is a famous traditional dish from ${c.name}?`,
    correct: d.dish,
    wrong: pickRandom(DISH_POOL, 3, d.dish),
    category: "culture",
    explanation: `${d.dish} is a famous traditional dish from ${c.name}.`
  }),
];

const MEDIUM_TEMPLATES: QuestionTemplate[] = [
  (c, d) => ({
    text: `Which famous landmark can be found in ${c.name}?`,
    correct: d.landmark,
    wrong: pickRandom(LANDMARK_POOL, 3, d.landmark),
    category: "landmarks",
    explanation: `${d.landmark} is a famous landmark in ${c.name}.`
  }),
  (c, d) => ({
    text: `What is ${c.name} particularly known for?`,
    correct: d.knownFor,
    wrong: pickRandom([
      "Nuclear energy production", "Space exploration program", "World's largest desert",
      "Diamond mining industry", "Automotive manufacturing", "Silk production",
      "Gold reserves", "Volcanic islands", "Ancient Roman ruins",
      "Coffee production", "Tropical rainforests", "Arctic exploration"
    ], 3, d.knownFor),
    category: "facts",
    explanation: `${c.name} is particularly known for: ${d.knownFor}.`
  }),
  (c, d) => ({
    text: `In which hemisphere is ${c.name} primarily located?`,
    correct: `${d.hemisphere} Hemisphere`,
    wrong: pickRandom(["Northern Hemisphere", "Southern Hemisphere", "Both hemispheres"], 3, `${d.hemisphere} Hemisphere`),
    category: "geography",
    explanation: `${c.name} is primarily located in the ${d.hemisphere} Hemisphere.`
  }),
  (c, d) => d.independence ? ({
    text: `When did ${c.name} gain independence?`,
    correct: d.independence,
    wrong: [
      String(parseInt(d.independence) - 23),
      String(parseInt(d.independence) + 17),
      String(parseInt(d.independence) - 41),
    ],
    category: "history",
    explanation: `${c.name} gained independence in ${d.independence}.`
  }) : null,
  (c, d) => d.historicalEmpire ? ({
    text: `Which empire or power historically controlled ${c.name}?`,
    correct: d.historicalEmpire,
    wrong: pickRandom(["Roman Empire", "British Empire", "French Empire", "Spanish Empire", "Ottoman Empire", "Portuguese Empire", "Dutch Empire", "Belgian Empire", "Soviet Union", "German Empire", "Italian Empire", "Austro-Hungarian Empire"], 3, d.historicalEmpire),
    category: "history",
    explanation: `${c.name} was historically controlled by the ${d.historicalEmpire}.`
  }) : null,
];

const HARD_TEMPLATES: QuestionTemplate[] = [
  (c, d) => ({
    text: `${d.capital} is the capital city of which country?`,
    correct: c.name,
    wrong: pickRandom(Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name), 3),
    category: "geography",
    explanation: `${d.capital} is the capital of ${c.name}.`
  }),
  (c, d) => ({
    text: `The ${d.currency} is the official currency of which country?`,
    correct: c.name,
    wrong: pickRandom(Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name && REAL_COUNTRY_DATA[n].currency !== d.currency), 3),
    category: "culture",
    explanation: `The ${d.currency} is the official currency of ${c.name}.`
  }),
  (c, d) => ({
    text: `${d.landmark} is located in which country?`,
    correct: c.name,
    wrong: pickRandom(Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name), 3),
    category: "landmarks",
    explanation: `${d.landmark} is located in ${c.name}.`
  }),
  (c, d) => ({
    text: `The traditional dish "${d.dish}" originates from which country?`,
    correct: c.name,
    wrong: pickRandom(Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name), 3),
    category: "culture",
    explanation: `${d.dish} is a traditional dish from ${c.name}.`
  }),
  (c, d) => d.independence ? ({
    text: `Which country gained independence in ${d.independence}?`,
    correct: c.name,
    wrong: pickRandom(
      Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name && REAL_COUNTRY_DATA[n].independence !== d.independence),
      3
    ),
    category: "history",
    explanation: `${c.name} gained independence in ${d.independence}.`
  }) : null,
];

function buildQuestion(
  country: CountryInput,
  data: CountryFactData,
  template: QuestionTemplate,
  difficulty: string,
  index: number
): Question | null {
  const result = template(country, data);
  if (!result) return null;

  const allOptions = shuffleArray([result.correct, ...result.wrong.slice(0, 3)]);
  
  // Ensure exactly 4 unique options
  const uniqueOptions = [...new Set(allOptions)];
  if (uniqueOptions.length < 4) return null;

  return {
    id: `real-${country.id}-${difficulty}-${result.category}-${index}-${Date.now()}`,
    type: 'multiple-choice',
    text: result.text,
    choices: uniqueOptions.slice(0, 4).map((opt, i) => ({
      id: String.fromCharCode(97 + i),
      text: opt,
      isCorrect: opt === result.correct,
    })),
    category: result.category as any,
    difficulty: difficulty as any,
    explanation: result.explanation,
  };
}

export function generateRealQuestions(
  country: CountryInput,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  targetCount: number = 10
): Question[] {
  const data = REAL_COUNTRY_DATA[country.name];
  if (!data) {
    console.warn(`No real data found for ${country.name}`);
    return [];
  }

  const templates = difficulty === 'easy' ? EASY_TEMPLATES
    : difficulty === 'hard' ? HARD_TEMPLATES
    : MEDIUM_TEMPLATES;

  const questions: Question[] = [];
  
  for (let i = 0; i < targetCount; i++) {
    const template = templates[i % templates.length];
    const q = buildQuestion(country, data, template, difficulty, i);
    if (q) questions.push(q);
  }

  return questions;
}

export async function generateAndSaveRealQuestions(
  country: CountryInput,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 10
): Promise<number> {
  const questions = generateRealQuestions(country, difficulty, count);
  
  if (questions.length === 0) return 0;

  const { QuestionService } = await import("../services/supabase/questionService");
  const currentMonth = new Date().getMonth() + 1;

  const questionsToInsert = questions.map(q => ({
    id: q.id,
    country_id: country.id,
    text: q.text,
    option_a: q.choices[0]?.text || '',
    option_b: q.choices[1]?.text || '',
    option_c: q.choices[2]?.text || '',
    option_d: q.choices[3]?.text || '',
    correct_answer: q.choices.find(c => c.isCorrect)?.text || '',
    difficulty: difficulty,
    category: q.category,
    explanation: q.explanation,
    month_rotation: currentMonth,
    ai_generated: false,
  }));

  await QuestionService.saveQuestions(questionsToInsert);
  return questions.length;
}
