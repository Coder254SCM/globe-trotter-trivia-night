
import { Question } from "@/types/quiz";
import { Country } from "../supabase/country/countryTypes";

// Simple question templates for different categories
const QUESTION_TEMPLATES = {
  geography: [
    {
      template: "What is the capital of {country}?",
      generateOptions: (country: Country) => ({
        correct: country.capital || "Unknown",
        wrong: ["Paris", "London", "Berlin", "Madrid", "Rome", "Tokyo"].filter(c => c !== country.capital)
      })
    },
    {
      template: "Which continent is {country} located in?",
      generateOptions: (country: Country) => ({
        correct: country.continent,
        wrong: ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"].filter(c => c !== country.continent)
      })
    },
    {
      template: "{country} is located in which region of the world?",
      generateOptions: (country: Country) => ({
        correct: country.continent,
        wrong: ["Arctic", "Antarctic", "Pacific Islands", "Caribbean"].filter(c => c !== country.continent)
      })
    },
    {
      template: "What is the main continent where {country} can be found?",
      generateOptions: (country: Country) => ({
        correct: country.continent,
        wrong: ["Antarctica", "Eurasia", "Americas"].filter(c => c !== country.continent)
      })
    },
    {
      template: "In which part of the world is {country} situated?",
      generateOptions: (country: Country) => ({
        correct: country.continent,
        wrong: ["Northern Hemisphere", "Southern Hemisphere", "Eastern Hemisphere", "Western Hemisphere"].filter(c => c !== country.continent)
      })
    }
  ],
  
  culture: [
    {
      template: "What is the primary language spoken in {country}?",
      generateOptions: (country: Country) => {
        const languages = getLanguageForCountry(country.name);
        return {
          correct: languages.primary,
          wrong: ["English", "Spanish", "French", "German", "Portuguese", "Arabic"].filter(l => l !== languages.primary)
        };
      }
    },
    {
      template: "Which currency is primarily used in {country}?",
      generateOptions: (country: Country) => {
        const currency = getCurrencyForCountry(country.name);
        return {
          correct: currency,
          wrong: ["US Dollar", "Euro", "British Pound", "Japanese Yen", "Canadian Dollar"].filter(c => c !== currency)
        };
      }
    }
  ],

  history: [
    {
      template: "When did {country} gain its independence?",
      generateOptions: (country: Country) => {
        const year = getIndependenceYear(country.name);
        return {
          correct: year,
          wrong: generateRandomYears(year)
        };
      }
    }
  ],

  facts: [
    {
      template: "What is {country} known for?",
      generateOptions: (country: Country) => {
        const fact = getFamousFor(country.name);
        return {
          correct: fact,
          wrong: ["Ancient pyramids", "Tropical beaches", "Mountain ranges", "Desert landscapes"].filter(f => f !== fact)
        };
      }
    }
  ]
};

// Helper functions to get country-specific data
function getLanguageForCountry(countryName: string) {
  const languageMap: Record<string, { primary: string }> = {
    "France": { primary: "French" },
    "Germany": { primary: "German" },
    "Spain": { primary: "Spanish" },
    "Italy": { primary: "Italian" },
    "Japan": { primary: "Japanese" },
    "China": { primary: "Chinese" },
    "Brazil": { primary: "Portuguese" },
    "Russia": { primary: "Russian" },
    // Add more mappings as needed
  };
  return languageMap[countryName] || { primary: "Local Language" };
}

function getCurrencyForCountry(countryName: string) {
  const currencyMap: Record<string, string> = {
    "United States": "US Dollar",
    "Germany": "Euro",
    "France": "Euro",
    "Japan": "Japanese Yen",
    "United Kingdom": "British Pound",
    "Brazil": "Brazilian Real",
    // Add more mappings as needed
  };
  return currencyMap[countryName] || "Local Currency";
}

function getIndependenceYear(countryName: string) {
  const independenceMap: Record<string, string> = {
    "United States": "1776",
    "Brazil": "1822",
    "India": "1947",
    "Nigeria": "1960",
    // Add more mappings as needed
  };
  return independenceMap[countryName] || "Historical Period";
}

function getFamousFor(countryName: string) {
  const famousMap: Record<string, string> = {
    "France": "Eiffel Tower and cuisine",
    "Italy": "Colosseum and pasta",
    "Japan": "Mount Fuji and technology",
    "Egypt": "Pyramids and ancient history",
    "Brazil": "Amazon rainforest and football",
    // Add more mappings as needed
  };
  return famousMap[countryName] || "Cultural heritage";
}

function generateRandomYears(correctYear: string): string[] {
  const baseYear = parseInt(correctYear) || 1900;
  return [
    (baseYear - 50).toString(),
    (baseYear + 25).toString(),
    (baseYear - 25).toString()
  ];
}

// Main generation function
export function generateQuestionsForCountry(
  country: Country,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  targetCount: number = 50
): Question[] {
  const questions: Question[] = [];
  const categories = Object.keys(QUESTION_TEMPLATES);
  
  // Generate questions from all categories
  for (let i = 0; i < targetCount; i++) {
    const categoryKey = categories[i % categories.length] as keyof typeof QUESTION_TEMPLATES;
    const templates = QUESTION_TEMPLATES[categoryKey];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    try {
      const questionText = template.template.replace(/{country}/g, country.name);
      const options = template.generateOptions(country);
      
      // Ensure we have enough wrong answers
      const wrongAnswers = options.wrong.slice(0, 3);
      const allOptions = [options.correct, ...wrongAnswers].slice(0, 4);
      
      // Shuffle options
      const shuffledOptions = shuffleArray([...allOptions]);
      
      const question: Question = {
        id: `simple-${country.id}-${categoryKey}-${i}-${Date.now()}`,
        type: 'multiple-choice',
        text: questionText,
        choices: shuffledOptions.map((option, index) => ({
          id: String.fromCharCode(97 + index), // a, b, c, d
          text: option,
          isCorrect: option === options.correct
        })),
        category: categoryKey as any,
        difficulty: difficulty as any,
        explanation: `The correct answer is ${options.correct}.`
      };
      
      questions.push(question);
    } catch (error) {
      console.warn(`Failed to generate question ${i} for ${country.name}:`, error);
    }
  }
  
  return questions;
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to generate and save questions for a country
export async function generateAndSaveQuestions(
  country: Country,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 50
): Promise<void> {
  console.log(`🎯 Generating ${count} questions for ${country.name}...`);
  
  const questions = generateQuestionsForCountry(country, difficulty, count);
  
  if (questions.length > 0) {
    // Save to database
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
      ai_generated: false
    }));

    await QuestionService.saveQuestions(questionsToInsert);
    console.log(`✅ Generated and saved ${questions.length} questions for ${country.name}`);
  }
}
