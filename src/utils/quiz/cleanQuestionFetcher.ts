
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";

/**
 * Simplified and reliable question fetcher
 */
export const getCleanQuizQuestions = async (
  countryId: string,
  difficulty: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🔍 [CleanFetcher] Fetching ${count} ${difficulty} questions for countryId: ${countryId}`);
  
  try {
    // Strategy 1: Try exact match first
    let questions = await QuestionService.getFilteredQuestions({
      countryId,
      difficulty,
      limit: count,
      validateContent: true
    });
    
    console.log(`📋 [CleanFetcher] Found ${questions.length} questions with exact match`);
    
    // Strategy 2: If not enough, try any difficulty for the country
    if (questions.length < count) {
      const additionalQuestions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: count - questions.length,
        validateContent: true
      });
      
      // Add unique questions only
      const existingIds = new Set(questions.map(q => q.id));
      const newQuestions = additionalQuestions.filter(q => !existingIds.has(q.id));
      questions = [...questions, ...newQuestions];
      
      console.log(`📋 [CleanFetcher] After fallback: ${questions.length} total questions`);
    }
    
    // Strategy 3: If still no questions, try basic fetch
    if (questions.length === 0) {
      console.log(`🔄 [CleanFetcher] Trying basic fetch...`);
      questions = await QuestionService.getQuestions(countryId, difficulty, count);
      console.log(`📋 [CleanFetcher] Basic fetch returned: ${questions.length} questions`);
    }

    return questions.slice(0, count);

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
