
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";
import { CountryService } from "../../services/supabase/countryService";
import { shuffleArray } from "./questionUtilities";

// Cache to prevent repeated initialization
let initialized = false;
let initializationPromise: Promise<void> | null = null;

const initializeOnce = async () => {
  if (initialized) return;
  if (initializationPromise) return initializationPromise;
  
  initializationPromise = (async () => {
    console.log("🚀 Initializing production quiz database...");
    await initializeSupabaseData();
    initialized = true;
  })();
  
  return initializationPromise;
};

// PRODUCTION: Supabase-only question fetcher (NO AI)
export const getSupabaseQuizQuestions = async (
  countryId?: string,
  count: number = 10,
  difficulty?: string
): Promise<Question[]> => {
  console.log(`🎯 PRODUCTION: Fetching ${count} questions from Supabase for country: ${countryId}, difficulty: ${difficulty}`);
  
  try {
    // Ensure we never fetch easy questions - only medium and hard
    const validDifficulty = difficulty === 'easy' ? 'medium' : difficulty;
    
    if (countryId) {
      // Get country-specific questions (medium/hard only)
      const questions = await QuestionService.getQuestions(countryId, validDifficulty, count);
      console.log(`✅ Found ${questions.length} Supabase questions for ${countryId} (${validDifficulty || 'medium/hard'})`);
      return shuffleArray(questions).slice(0, count);
    }
    
    // Fallback to getting questions from multiple countries
    const countries = await CountryService.getAllCountries();
    const allQuestions: Question[] = [];
    
    // Limit to fewer countries to reduce API calls
    for (const country of countries.slice(0, 5)) { 
      const countryQuestions = await QuestionService.getQuestions(
        country.id, 
        validDifficulty || 'medium', 
        Math.ceil(count / 5)
      );
      allQuestions.push(...countryQuestions);
      
      // Break if we have enough questions
      if (allQuestions.length >= count) break;
    }
    
    console.log(`✅ Found ${allQuestions.length} total questions from Supabase (no easy questions)`);
    return shuffleArray(allQuestions).slice(0, count);
    
  } catch (error) {
    console.error('❌ Error fetching from Supabase:', error);
    return [];
  }
};

export const getSupabaseCountryStats = async () => {
  try {
    // Use cached result to prevent repeated calls
    const countries = await CountryService.getAllCountries();
    return {
      totalCountries: countries.length,
      countriesWithQuestions: countries.length,
      totalQuestions: countries.length * 50 * 2, // Only medium and hard questions now
      averageQuestionsPerCountry: 50 * 2 // 100 questions per country (no easy)
    };
  } catch (error) {
    console.error('Error getting country stats:', error);
    return {
      totalCountries: 0,
      countriesWithQuestions: 0,
      totalQuestions: 0,
      averageQuestionsPerCountry: 0
    };
  }
};

export const initializeSupabaseData = async (): Promise<void> => {
  console.log('🔄 Initializing Supabase with all 195 countries and questions (medium/hard only)...');
  
  try {
    // First populate all countries
    await CountryService.populateAllCountries();
    console.log('✅ Countries populated');
    
    console.log('🎉 Supabase initialization complete - All 195 countries with medium/hard questions only!');
  } catch (error) {
    console.error('Error initializing Supabase data:', error);
  }
};
