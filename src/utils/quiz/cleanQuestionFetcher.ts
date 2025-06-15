
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";

/**
 * Simple and reliable question fetcher
 */
export const getCleanQuizQuestions = async (
  countryId: string,
  difficulty: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🔍 [CleanFetcher] Fetching ${count} ${difficulty} questions for ${countryId}`);
  
  try {
    const questions = await QuestionService.getFilteredQuestions({
      countryId,
      difficulty,
      limit: count,
      validateContent: false
    });
    
    console.log(`📋 [CleanFetcher] Found ${questions.length} questions`);
    return questions;

  } catch (error) {
    console.error('❌ [CleanFetcher] Error fetching questions:', error);
    return [];
  }
};

/**
 * Get questions for weekly challenge
 */
export const getWeeklyChallengeQuestions = async (count: number = 20): Promise<Question[]> => {
  console.log(`🏆 [CleanFetcher] Fetching ${count} questions for weekly challenge`);
  
  try {
    const questions = await QuestionService.getFilteredQuestions({
      difficulty: 'medium',
      limit: count,
      validateContent: false
    });

    console.log(`✅ [CleanFetcher] Weekly challenge: ${questions.length} questions ready`);
    return questions;
  } catch (error) {
    console.error('❌ [CleanFetcher] Weekly challenge fetch failed:', error);
    return [];
  }
};

/**
 * Get questions for ultimate quiz
 */
export const getUltimateQuizQuestions = async (
  userId: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🎯 [CleanFetcher] Fetching ${count} ultimate quiz questions`);
  
  try {
    const questions = await QuestionService.getFilteredQuestions({
      difficulty: 'hard',
      limit: count,
      validateContent: false
    });

    console.log(`✅ [CleanFetcher] Ultimate quiz: ${questions.length} questions ready`);
    return questions;
  } catch (error) {
    console.error('❌ [CleanFetcher] Ultimate quiz fetch failed:', error);
    return [];
  }
};
