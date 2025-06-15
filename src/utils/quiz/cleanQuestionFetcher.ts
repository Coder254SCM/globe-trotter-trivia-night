
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";

/**
 * Clean and reliable question fetcher with better error handling
 */
export const getCleanQuizQuestions = async (
  countryId: string,
  difficulty: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🔍 [CleanFetcher] Fetching ${count} ${difficulty} questions for countryId: ${countryId}`);
  
  try {
    // Try to get questions with the specified difficulty
    let questions = await QuestionService.getFilteredQuestions({
      countryId,
      difficulty,
      limit: count,
      validateContent: true
    });
    
    console.log(`📋 [CleanFetcher] Found ${questions.length} questions with difficulty: ${difficulty}`);
    
    // If we don't have enough questions with the specified difficulty, try any difficulty
    if (questions.length < count) {
      console.log(`🔄 [CleanFetcher] Not enough questions, trying any difficulty...`);
      
      const fallbackQuestions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: count,
        validateContent: true
      });
      
      // Merge results, avoiding duplicates
      const existingIds = new Set(questions.map(q => q.id));
      const newQuestions = fallbackQuestions.filter(q => !existingIds.has(q.id));
      questions = [...questions, ...newQuestions].slice(0, count);
      
      console.log(`📋 [CleanFetcher] After fallback: ${questions.length} total questions`);
    }

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
    return questions.slice(0, count);
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
    return questions.slice(0, count);
  } catch (error) {
    console.error('❌ [CleanFetcher] Ultimate quiz fetch failed:', error);
    return [];
  }
};
