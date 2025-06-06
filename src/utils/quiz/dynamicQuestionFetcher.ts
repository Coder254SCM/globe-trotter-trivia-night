
import { Question } from "../../types/quiz";
import { questionStorage } from "./dynamicQuestionStorage";
import { shuffleArray } from "./questionUtilities";

// New dynamic question fetcher
export const getDynamicQuizQuestions = async (
  countryId?: string,
  count: number = 10,
  difficulty?: string
): Promise<Question[]> => {
  console.log(`🎯 Fetching ${count} questions dynamically for country: ${countryId}, difficulty: ${difficulty}`);
  
  let questionPool: Question[] = [];
  
  if (countryId) {
    // Get questions for specific country
    const countryQuestions = await questionStorage.getQuestions(countryId);
    questionPool = countryQuestions;
    
    if (difficulty) {
      questionPool = questionPool.filter(q => q.difficulty === difficulty);
    }
    
    console.log(`✅ Found ${questionPool.length} questions for ${countryId}`);
  } else {
    // Get questions from all countries
    const allCountries = await questionStorage.getAllCountriesWithQuestions();
    for (const country of allCountries) {
      const countryQuestions = await questionStorage.getQuestions(country);
      questionPool.push(...countryQuestions);
    }
    
    if (difficulty) {
      questionPool = questionPool.filter(q => q.difficulty === difficulty);
    }
    
    console.log(`✅ Found ${questionPool.length} total questions from all countries`);
  }
  
  // Shuffle and return requested count
  const selectedQuestions = shuffleArray(questionPool).slice(0, count);
  console.log(`🎲 Returning ${selectedQuestions.length} questions`);
  
  return selectedQuestions;
};

export const getDynamicQuestionStats = async () => {
  const allCountries = await questionStorage.getAllCountriesWithQuestions();
  const totalQuestions = await questionStorage.getTotalQuestionCount();
  
  return {
    totalCountries: 195, // We know we have 195 countries
    countriesWithQuestions: allCountries.length,
    totalQuestions,
    averageQuestionsPerCountry: allCountries.length > 0 ? totalQuestions / allCountries.length : 0
  };
};

export const addQuestionToCountry = async (countryId: string, question: Question): Promise<void> => {
  await questionStorage.addQuestion(countryId, question);
  console.log(`✅ Added question to ${countryId}: ${question.text}`);
};

export const getCountriesWithQuestions = async (): Promise<string[]> => {
  return await questionStorage.getAllCountriesWithQuestions();
};
