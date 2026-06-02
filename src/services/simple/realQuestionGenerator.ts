/**
 * Generates high-quality, factually accurate quiz questions using real country data.
 * Includes population comparison, flag identification, and neighbor country questions.
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

function formatPopulation(pop: number): string {
  if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(1)} billion`;
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)} million`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)} thousand`;
  return String(pop);
}

// Get countries from same continent for realistic wrong answers
function getSameContinent(countryName: string, continent: string, count: number): string[] {
  const sameContinent = Object.entries(REAL_COUNTRY_DATA)
    .filter(([name]) => name !== countryName)
    .map(([name]) => name);
  return pickRandom(sameContinent, count);
}

// Pool of wrong answers by type
const CAPITAL_POOL = ["Tokyo", "Paris", "London", "Berlin", "Madrid", "Rome", "Ottawa", "Canberra", "Brasília", "Moscow", "Beijing", "New Delhi", "Cairo", "Nairobi", "Lima", "Bangkok", "Seoul", "Ankara", "Vienna", "Warsaw", "Lisbon", "Athens", "Budapest", "Prague", "Stockholm", "Oslo", "Helsinki", "Copenhagen", "Dublin", "Brussels", "Amsterdam", "Bern", "Riyadh", "Doha", "Hanoi", "Manila", "Jakarta", "Kuala Lumpur", "Singapore", "Accra", "Addis Ababa", "Dakar"];
const CURRENCY_POOL = ["US Dollar", "Euro", "British Pound", "Japanese Yen", "Chinese Yuan", "Indian Rupee", "Australian Dollar", "Canadian Dollar", "Swiss Franc", "Brazilian Real", "South Korean Won", "Mexican Peso", "Russian Ruble", "Turkish Lira", "South African Rand", "Nigerian Naira", "Egyptian Pound", "Thai Baht", "Vietnamese Dong", "Philippine Peso"];
const LANGUAGE_POOL = ["English", "Spanish", "French", "Portuguese", "Arabic", "Mandarin Chinese", "Hindi", "Russian", "German", "Japanese", "Korean", "Italian", "Dutch", "Swedish", "Polish", "Turkish", "Swahili", "Bengali", "Vietnamese", "Thai"];
const CONTINENT_POOL = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
const DISH_POOL = ["Sushi", "Pizza", "Tacos", "Biryani", "Paella", "Pho", "Dim Sum", "Kebab", "Feijoada", "Pad Thai", "Croissant", "Borscht", "Pierogi", "Couscous", "Jollof Rice", "Empanadas", "Ramen", "Fish and Chips", "Hamburger", "Poutine"];
const LANDMARK_POOL = ["Eiffel Tower", "Great Wall of China", "Taj Mahal", "Colosseum", "Machu Picchu", "Statue of Liberty", "Big Ben", "Sydney Opera House", "Christ the Redeemer", "Pyramids of Giza", "Angkor Wat", "Petra", "Hagia Sophia", "Mount Fuji", "Sagrada Família", "Acropolis", "Chichen Itza", "Brandenburg Gate", "Table Mountain", "Blue Lagoon"];

type QuestionTemplate = (country: CountryInput, data: CountryFactData) => { text: string; correct: string; wrong: string[]; category: string; explanation: string } | null;

// ========== EASY TEMPLATES ==========
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
  // FLAG - easy: color identification
  (c, d) => ({
    text: `Which country has a flag described as: "${d.flagColors}"?`,
    correct: c.name,
    wrong: pickRandom(Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name), 3),
    category: "flags",
    explanation: `The flag of ${c.name} is: ${d.flagColors}.`
  }),
  // POPULATION - easy: rough range
  (c, d) => {
    const pop = d.population;
    const label = pop > 100_000_000 ? "more than 100 million" : pop > 10_000_000 ? "more than 10 million" : pop > 1_000_000 ? "more than 1 million" : "less than 1 million";
    const options = ["less than 1 million", "more than 1 million", "more than 10 million", "more than 100 million"];
    const wrong = options.filter(o => o !== label).slice(0, 3);
    return {
      text: `The population of ${c.name} is approximately:`,
      correct: label,
      wrong,
      category: "demographics",
      explanation: `${c.name} has a population of approximately ${formatPopulation(pop)}.`
    };
  },
];

// ========== MEDIUM TEMPLATES ==========
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
  // NEIGHBOR - medium: identify a neighbor
  (c, d) => d.neighbors.length > 0 ? ({
    text: `Which of these countries shares a border with ${c.name}?`,
    correct: d.neighbors[0],
    wrong: pickRandom(
      Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name && !d.neighbors.includes(n)),
      3
    ),
    category: "geography",
    explanation: `${d.neighbors[0]} shares a border with ${c.name}. Its neighbors include: ${d.neighbors.join(', ')}.`
  }) : null,
  // NEIGHBOR - medium: NOT a neighbor
  (c, d) => d.neighbors.length > 0 ? (() => {
    const nonNeighbors = Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name && !d.neighbors.includes(n));
    const correctNonNeighbor = pickRandom(nonNeighbors, 1)[0];
    return {
      text: `Which of these countries does NOT share a border with ${c.name}?`,
      correct: correctNonNeighbor,
      wrong: pickRandom(d.neighbors, Math.min(3, d.neighbors.length)),
      category: "geography",
      explanation: `${correctNonNeighbor} does not share a border with ${c.name}. Its actual neighbors are: ${d.neighbors.join(', ')}.`
    };
  })() : null,
  // POPULATION comparison - medium
  (c, d) => {
    const allCountries = Object.entries(REAL_COUNTRY_DATA).filter(([n]) => n !== c.name);
    const larger = allCountries.filter(([, data]) => data.population > d.population * 2).map(([n]) => n);
    const smaller = allCountries.filter(([, data]) => data.population < d.population / 2).map(([n]) => n);
    if (larger.length === 0 || smaller.length === 0) return null;
    const wrongLarger = pickRandom(larger, 1);
    const wrongSmaller = pickRandom(smaller, 2);
    return {
      text: `Which country has a similar or closest population to ${c.name} (~${formatPopulation(d.population)})?`,
      correct: c.name,
      wrong: [...wrongLarger, ...wrongSmaller],
      category: "demographics",
      explanation: `${c.name} has a population of approximately ${formatPopulation(d.population)}.`
    };
  },
  // FLAG description - medium
  (c, d) => ({
    text: `The flag of ${c.name} can be described as:`,
    correct: d.flagColors,
    wrong: pickRandom(
      Object.entries(REAL_COUNTRY_DATA).filter(([n]) => n !== c.name).map(([, data]) => data.flagColors),
      3
    ),
    category: "flags",
    explanation: `The flag of ${c.name} is: ${d.flagColors}.`
  }),
];

// ========== HARD TEMPLATES ==========
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
  // POPULATION comparison - hard: which has MORE population
  (c, d) => {
    const others = Object.entries(REAL_COUNTRY_DATA)
      .filter(([n, data]) => n !== c.name && data.population < d.population)
      .map(([n]) => n);
    if (others.length < 3) return null;
    const wrongCountries = pickRandom(others, 3);
    return {
      text: `Which of these countries has the LARGEST population?`,
      correct: c.name,
      wrong: wrongCountries,
      category: "demographics",
      explanation: `${c.name} has a population of ~${formatPopulation(d.population)}, which is the largest among the options.`
    };
  },
  // POPULATION comparison - hard: which has FEWER people
  (c, d) => {
    const others = Object.entries(REAL_COUNTRY_DATA)
      .filter(([n, data]) => n !== c.name && data.population > d.population)
      .map(([n]) => n);
    if (others.length < 3) return null;
    const wrongCountries = pickRandom(others, 3);
    return {
      text: `Which of these countries has the SMALLEST population?`,
      correct: c.name,
      wrong: wrongCountries,
      category: "demographics",
      explanation: `${c.name} has a population of ~${formatPopulation(d.population)}, which is the smallest among the options.`
    };
  },
  // NEIGHBOR count - hard
  (c, d) => {
    const count = d.neighbors.length;
    const wrong = [count + 2, count + 4, Math.max(0, count - 2)].map(String);
    return {
      text: `How many countries share a land border with ${c.name}?`,
      correct: String(count),
      wrong,
      category: "geography",
      explanation: `${c.name} shares land borders with ${count} countries: ${d.neighbors.join(', ') || 'none (island nation)'}.`
    };
  },
  // FLAG identification - hard: reversed
  (c, d) => ({
    text: `A flag described as "${d.flagColors}" belongs to which country?`,
    correct: c.name,
    wrong: pickRandom(Object.keys(REAL_COUNTRY_DATA).filter(n => n !== c.name), 3),
    category: "flags",
    explanation: `The flag with ${d.flagColors} belongs to ${c.name}.`
  }),
  // NEIGHBOR chain - hard
  (c, d) => d.neighbors.length >= 2 ? (() => {
    const n1 = d.neighbors[0];
    const n2 = d.neighbors[1];
    return {
      text: `${c.name} shares borders with both ${n1} and ${n2}. Which continent is it in?`,
      correct: c.continent,
      wrong: pickRandom(CONTINENT_POOL, 3, c.continent),
      category: "geography",
      explanation: `${c.name}, bordering ${n1} and ${n2}, is located in ${c.continent}.`
    };
  })() : null,
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
    id: `real-${country.id}-${difficulty}-${result.category}-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
  
  for (let i = 0; i < targetCount * 2 && questions.length < targetCount; i++) {
    const template = templates[i % templates.length];
    const q = buildQuestion(country, data, template, difficulty, i);
    if (q) questions.push(q);
  }

  return questions;
}

export function getQuestionCounts(countryName: string): { easy: number; medium: number; hard: number; total: number } {
  const data = REAL_COUNTRY_DATA[countryName];
  if (!data) return { easy: 0, medium: 0, hard: 0, total: 0 };

  const mockCountry: CountryInput = {
    id: countryName.toLowerCase().replace(/\s+/g, '-'),
    name: countryName,
    continent: data.continent || '',
  };

  const countValid = (templates: QuestionTemplate[]) =>
    templates.reduce((n, t) => {
      try {
        const r = t(mockCountry, data);
        return r ? n + 1 : n;
      } catch {
        return n;
      }
    }, 0);

  const easy = countValid(EASY_TEMPLATES);
  const medium = countValid(MEDIUM_TEMPLATES);
  const hard = countValid(HARD_TEMPLATES);
  return { easy, medium, hard, total: easy + medium + hard };
}

export async function generateAndSaveRealQuestions(
  country: CountryInput,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 10
): Promise<number> {
  const questions = generateRealQuestions(country, difficulty, count);
  
  if (questions.length === 0) return 0;

  const { QuestionService } = await import("../supabase/questionService");
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
