
import { Question } from "@/types/quiz";
import { Country } from "../supabase/country/countryTypes";

// Enhanced templates with more variety
const ENHANCED_TEMPLATES = {
  geography: [
    {
      template: "What is the capital of {country}?",
      generateOptions: (country: Country) => ({
        correct: country.capital || "Unknown",
        wrong: ["Paris", "London", "Berlin", "Madrid", "Rome", "Tokyo", "Cairo", "Moscow", "Warsaw", "Vienna"].filter(c => c !== country.capital)
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
      template: "{country} is situated in which part of the world?",
      generateOptions: (country: Country) => ({
        correct: country.continent,
        wrong: ["Antarctica", "Arctic Region", "Pacific Islands"].filter(c => c !== country.continent)
      })
    },
    {
      template: "What is the main geographic region of {country}?",
      generateOptions: (country: Country) => ({
        correct: country.continent,
        wrong: ["Polar Region", "Tropical Zone", "Temperate Zone"].filter(c => c !== country.continent)
      })
    },
    {
      template: "In which hemisphere is {country} primarily located?",
      generateOptions: (country: Country) => {
        const hemisphere = country.continent === "South America" || country.continent === "Oceania" ? "Southern Hemisphere" : "Northern Hemisphere";
        return {
          correct: hemisphere,
          wrong: ["Eastern Hemisphere", "Western Hemisphere", "Polar Hemisphere"].filter(h => h !== hemisphere)
        };
      }
    }
  ],
  
  culture: [
    {
      template: "What is a traditional dish from {country}?",
      generateOptions: (country: Country) => {
        const dishes = getDishForCountry(country.name);
        return {
          correct: dishes.traditional,
          wrong: ["Pizza", "Sushi", "Tacos", "Curry", "Pasta", "Burger"].filter(d => d !== dishes.traditional)
        };
      }
    },
    {
      template: "Which language is commonly spoken in {country}?",
      generateOptions: (country: Country) => {
        const language = getLanguageForCountry(country.name);
        return {
          correct: language.primary,
          wrong: ["English", "Spanish", "French", "German", "Arabic", "Chinese"].filter(l => l !== language.primary)
        };
      }
    },
    {
      template: "What currency is used in {country}?",
      generateOptions: (country: Country) => {
        const currency = getCurrencyForCountry(country.name);
        return {
          correct: currency,
          wrong: ["US Dollar", "Euro", "British Pound", "Japanese Yen", "Canadian Dollar", "Swiss Franc"].filter(c => c !== currency)
        };
      }
    }
  ],
  
  history: [
    {
      template: "When did {country} gain independence?",
      generateOptions: (country: Country) => {
        const year = getIndependenceYear(country.name);
        return {
          correct: year,
          wrong: generateHistoricalYears(year)
        };
      }
    },
    {
      template: "Which empire historically controlled {country}?",
      generateOptions: (country: Country) => {
        const empire = getHistoricalEmpire(country.name);
        return {
          correct: empire,
          wrong: ["Roman Empire", "British Empire", "Ottoman Empire", "French Empire"].filter(e => e !== empire)
        };
      }
    }
  ],
  
  landmarks: [
    {
      template: "What is a famous landmark in {country}?",
      generateOptions: (country: Country) => {
        const landmark = getFamousLandmark(country.name);
        return {
          correct: landmark,
          wrong: ["Eiffel Tower", "Big Ben", "Statue of Liberty", "Taj Mahal", "Great Wall"].filter(l => l !== landmark)
        };
      }
    }
  ],
  
  facts: [
    {
      template: "What is {country} particularly known for?",
      generateOptions: (country: Country) => {
        const fact = getFamousFor(country.name);
        return {
          correct: fact,
          wrong: ["Oil production", "Wine making", "Technology", "Tourism", "Agriculture"].filter(f => f !== fact)
        };
      }
    }
  ]
};

// Helper functions with more comprehensive data
function getDishForCountry(countryName: string) {
  const dishMap: Record<string, { traditional: string }> = {
    "Albania": { traditional: "Tavë kosi" },
    "France": { traditional: "Coq au vin" },
    "Italy": { traditional: "Risotto" },
    "Spain": { traditional: "Paella" },
    "Germany": { traditional: "Sauerbraten" },
    "Japan": { traditional: "Ramen" },
    "China": { traditional: "Peking duck" },
    "India": { traditional: "Biryani" },
    "Mexico": { traditional: "Mole" },
    "Brazil": { traditional: "Feijoada" },
  };
  return dishMap[countryName] || { traditional: "Traditional cuisine" };
}

function getLanguageForCountry(countryName: string) {
  const languageMap: Record<string, { primary: string }> = {
    "Albania": { primary: "Albanian" },
    "France": { primary: "French" },
    "Germany": { primary: "German" },
    "Spain": { primary: "Spanish" },
    "Italy": { primary: "Italian" },
    "Japan": { primary: "Japanese" },
    "China": { primary: "Chinese" },
    "Brazil": { primary: "Portuguese" },
    "Russia": { primary: "Russian" },
    "India": { primary: "Hindi" },
  };
  return languageMap[countryName] || { primary: "Local language" };
}

function getCurrencyForCountry(countryName: string) {
  const currencyMap: Record<string, string> = {
    "Albania": "Albanian lek",
    "United States": "US Dollar",
    "Germany": "Euro",
    "France": "Euro",
    "Japan": "Japanese Yen",
    "United Kingdom": "British Pound",
    "Brazil": "Brazilian Real",
    "Russia": "Russian Ruble",
    "India": "Indian Rupee",
    "China": "Chinese Yuan",
  };
  return currencyMap[countryName] || "Local currency";
}

function getIndependenceYear(countryName: string) {
  const independenceMap: Record<string, string> = {
    "Albania": "1912",
    "United States": "1776",
    "Brazil": "1822",
    "India": "1947",
    "Nigeria": "1960",
    "Germany": "1871",
    "Italy": "1861",
    "Greece": "1821",
  };
  return independenceMap[countryName] || "Historic period";
}

function getHistoricalEmpire(countryName: string) {
  const empireMap: Record<string, string> = {
    "Albania": "Ottoman Empire",
    "India": "British Empire",
    "Algeria": "French Empire",
    "Peru": "Spanish Empire",
    "Romania": "Ottoman Empire",
  };
  return empireMap[countryName] || "Various empires";
}

function getFamousLandmark(countryName: string) {
  const landmarkMap: Record<string, string> = {
    "Albania": "Butrint National Park",
    "France": "Eiffel Tower",
    "Italy": "Colosseum",
    "Egypt": "Pyramids of Giza",
    "China": "Great Wall",
    "India": "Taj Mahal",
    "Brazil": "Christ the Redeemer",
    "Russia": "Red Square",
  };
  return landmarkMap[countryName] || "Historic sites";
}

function getFamousFor(countryName: string) {
  const famousMap: Record<string, string> = {
    "Albania": "Beautiful coastline and mountains",
    "France": "Art, culture, and cuisine",
    "Italy": "Renaissance art and architecture",
    "Japan": "Technology and tradition",
    "Egypt": "Ancient civilization and pyramids",
    "Brazil": "Amazon rainforest and carnival",
    "Switzerland": "Alps and precision manufacturing",
    "India": "Diverse culture and spices",
  };
  return famousMap[countryName] || "Cultural heritage";
}

function generateHistoricalYears(correctYear: string): string[] {
  const baseYear = parseInt(correctYear) || 1900;
  return [
    (baseYear - 50).toString(),
    (baseYear + 25).toString(),
    (baseYear - 25).toString()
  ];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateEnhancedQuestions(
  country: Country,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  targetCount: number = 50
): Question[] {
  const questions: Question[] = [];
  const categories = Object.keys(ENHANCED_TEMPLATES);
  
  // Generate questions ensuring variety across categories
  for (let i = 0; i < targetCount; i++) {
    const categoryKey = categories[i % categories.length] as keyof typeof ENHANCED_TEMPLATES;
    const templates = ENHANCED_TEMPLATES[categoryKey];
    const templateIndex = Math.floor(i / categories.length) % templates.length;
    const template = templates[templateIndex];
    
    try {
      const questionText = template.template.replace(/{country}/g, country.name);
      const options = template.generateOptions(country);
      
      // Ensure we have enough wrong answers
      const wrongAnswers = options.wrong.slice(0, 3);
      const allOptions = [options.correct, ...wrongAnswers];
      
      // Shuffle options
      const shuffledOptions = shuffleArray([...allOptions]);
      
      const question: Question = {
        id: `enhanced-${country.id}-${categoryKey}-${i}-${Date.now()}-${Math.random()}`,
        type: 'multiple-choice',
        text: questionText,
        choices: shuffledOptions.map((option, index) => ({
          id: String.fromCharCode(97 + index), // a, b, c, d
          text: option,
          isCorrect: option === options.correct
        })),
        category: categoryKey as any,
        difficulty: difficulty as any,
        explanation: `The correct answer is ${options.correct}. This relates to ${country.name}'s ${categoryKey}.`
      };
      
      questions.push(question);
    } catch (error) {
      console.warn(`Failed to generate question ${i} for ${country.name}:`, error);
    }
  }
  
  return questions;
}

export async function generateAndSaveEnhancedQuestions(
  country: Country,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 50
): Promise<void> {
  console.log(`🎯 Generating ${count} enhanced questions for ${country.name}...`);
  
  const questions = generateEnhancedQuestions(country, difficulty, count);
  
  if (questions.length > 0) {
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
    console.log(`✅ Generated and saved ${questions.length} enhanced questions for ${country.name}`);
  }
}
