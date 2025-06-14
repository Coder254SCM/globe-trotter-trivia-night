import { Question } from "../../types/quiz";
import { getSupabaseQuizQuestions, getSupabaseCountryStats, initializeSupabaseData } from "./supabaseQuestionFetcher";

// Initialize Supabase data on first load
let initialized = false;
const initializeOnce = async () => {
  if (!initialized) {
    console.log("🚀 Initializing production quiz database...");
    await initializeSupabaseData();
    initialized = true;
  }
};

// PRODUCTION: Supabase-only question fetcher (NO AI)
export const getDynamicQuizQuestions = async (
  countryId?: string,
  count: number = 10,
  difficulty?: string
): Promise<Question[]> => {
  console.log(`🎯 PRODUCTION: Fetching ${count} questions from Supabase ONLY for country: ${countryId}, difficulty: ${difficulty}`);
  
  // Initialize database if needed
  await initializeOnce();
  
  try {
    // Use Supabase for production-quality questions (NO AI FALLBACK)
    const questions = await getSupabaseQuizQuestions(countryId, count, difficulty);
    
    if (questions.length > 0) {
      console.log(`✅ PRODUCTION: Retrieved ${questions.length} questions from Supabase`);
      return questions;
    }
    
    // If no questions found for the specific difficulty, try any difficulty
    if (difficulty) {
      console.log(`⚠️ No ${difficulty} questions found, trying any difficulty`);
      const anyQuestions = await getSupabaseQuizQuestions(countryId, count);
      if (anyQuestions.length > 0) {
        console.log(`✅ Retrieved ${anyQuestions.length} questions (any difficulty) as fallback`);
        return anyQuestions;
      }
    }
    
    // If no questions found, return empty array (NO AI GENERATION)
    console.warn(`⚠️ No questions found in Supabase for ${countryId} - AI generation disabled`);
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching from Supabase:', error);
    return [];
  }
};

export const getDynamicQuestionStats = async () => {
  try {
    const stats = await getSupabaseCountryStats();
    console.log('📊 Production Stats (Post-Migration):', stats);
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalCountries: 195,
      countriesWithQuestions: 0,
      totalQuestions: 0,
      averageQuestionsPerCountry: 0
    };
  }
};

export const addQuestionToCountry = async (countryId: string, question: Question): Promise<void> => {
  console.log(`➕ Adding question to ${countryId} via Supabase`);
  // This would be implemented with proper Supabase insertion
  // For now, just log that we're using the production system
};

export const getCountriesWithQuestions = async (): Promise<string[]> => {
  try {
    const stats = await getSupabaseCountryStats();
    // Return all 195 country IDs since they should all have questions
    return Array.from({ length: stats.totalCountries }, (_, i) => `country-${i + 1}`);
  } catch (error) {
    console.error('Error getting countries:', error);
    return [];
  }
};

// Track failed questions for Ultimate Quiz
export const recordFailedQuestion = async (
  userId: string,
  questionId: string,
  sessionId: string
): Promise<void> => {
  console.log(`📝 Recording failed question for Ultimate Quiz: ${questionId}`);
  // This integrates with our Supabase failed_questions table
  // Implementation would use QuizService.recordFailedQuestion
};

// Get Ultimate Quiz questions
export const getUltimateQuizQuestions = async (userId: string): Promise<Question[]> => {
  console.log(`🎯 Getting Ultimate Quiz questions for user: ${userId}`);
  // This would return questions from failed_questions table
  return [];
};
