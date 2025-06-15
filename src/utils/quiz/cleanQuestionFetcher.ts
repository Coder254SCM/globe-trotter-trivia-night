
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";

/**
 * Enhanced clean question fetcher with comprehensive fallbacks for all difficulties
 */
export const getCleanQuizQuestions = async (
  countryId: string,
  difficulty: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🔍 [CleanFetcher] Fetching ${count} ${difficulty} questions for countryId: ${countryId}`);
  
  try {
    let questions: Question[] = [];

    // Strategy 1: Try exact match with difficulty and country
    if (difficulty && countryId) {
      questions = await QuestionService.getFilteredQuestions({
        countryId,
        difficulty,
        limit: count,
        validateContent: true
      });
      console.log(`📋 [CleanFetcher] Strategy 1 (exact match): Found ${questions.length} questions`);
    }

    // Strategy 2: If not enough, try without difficulty filter for same country
    if (questions.length < count) {
      console.log(`🔄 [CleanFetcher] Strategy 2: Trying without difficulty filter...`);
      
      const fallbackQuestions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: count,
        validateContent: true
      });
      
      // Merge unique questions
      const existingIds = new Set(questions.map(q => q.id));
      const newQuestions = fallbackQuestions.filter(q => !existingIds.has(q.id));
      questions = [...questions, ...newQuestions];
      
      console.log(`📋 [CleanFetcher] Strategy 2: Combined total ${questions.length} questions`);
    }

    // Strategy 3: If still not enough, try basic fetch
    if (questions.length < count) {
      console.log(`🔄 [CleanFetcher] Strategy 3: Trying basic fetch...`);
      
      const basicQuestions = await QuestionService.getQuestions(countryId, undefined, count);
      
      // Merge unique questions
      const existingIds = new Set(questions.map(q => q.id));
      const newQuestions = basicQuestions.filter(q => !existingIds.has(q.id));
      questions = [...questions, ...newQuestions];
      
      console.log(`📋 [CleanFetcher] Strategy 3: Combined total ${questions.length} questions`);
    }

    // Strategy 4: If still no questions, try any questions from the database
    if (questions.length === 0) {
      console.log(`🔄 [CleanFetcher] Strategy 4: Emergency fallback - fetching any available questions...`);
      
      const emergencyQuestions = await QuestionService.getFilteredQuestions({
        limit: count,
        validateContent: false // Less strict for emergency
      });
      
      questions = emergencyQuestions;
      console.log(`📋 [CleanFetcher] Strategy 4: Emergency fallback returned ${questions.length} questions`);
    }

    // Final validation and limiting
    if (questions.length > count) {
      questions = questions.slice(0, count);
    }

    console.log(`✅ [CleanFetcher] Returning ${questions.length} final questions for ${countryId}`);
    return questions;

  } catch (error) {
    console.error('❌ [CleanFetcher] Error in all strategies:', error);
    
    // Final emergency fallback
    try {
      console.log(`🚨 [CleanFetcher] Final emergency attempt...`);
      const emergencyQuestions = await QuestionService.getQuestions(countryId, undefined, count);
      console.log(`🚨 [CleanFetcher] Final emergency returned ${emergencyQuestions.length} questions`);
      return emergencyQuestions;
    } catch (finalError) {
      console.error('❌ [CleanFetcher] All strategies failed:', finalError);
      return [];
    }
  }
};

/**
 * Get questions for weekly challenge
 */
export const getWeeklyChallengeQuestions = async (count: number = 20): Promise<Question[]> => {
  console.log(`🏆 [CleanFetcher] Fetching ${count} questions for weekly challenge`);
  
  try {
    // Get hard questions from multiple countries for weekly challenge
    const questions = await QuestionService.getFilteredQuestions({
      difficulty: 'hard',
      limit: count,
      validateContent: true
    });

    if (questions.length < count) {
      // Fallback to medium questions if not enough hard questions
      const mediumQuestions = await QuestionService.getFilteredQuestions({
        difficulty: 'medium',
        limit: count - questions.length,
        validateContent: true
      });
      
      questions.push(...mediumQuestions);
    }

    console.log(`✅ [CleanFetcher] Weekly challenge: ${questions.length} questions ready`);
    return questions.slice(0, count);
  } catch (error) {
    console.error('❌ [CleanFetcher] Weekly challenge fetch failed:', error);
    return [];
  }
};

/**
 * Get questions for ultimate quiz (failed questions retry)
 */
export const getUltimateQuizQuestions = async (
  userId: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🎯 [CleanFetcher] Fetching ${count} ultimate quiz questions for user: ${userId}`);
  
  try {
    // This would integrate with failed questions tracking
    // For now, get challenging questions (hard difficulty)
    const questions = await QuestionService.getFilteredQuestions({
      difficulty: 'hard',
      limit: count,
      validateContent: true
    });

    console.log(`✅ [CleanFetcher] Ultimate quiz: ${questions.length} questions ready`);
    return questions;
  } catch (error) {
    console.error('❌ [CleanFetcher] Ultimate quiz fetch failed:', error);
    return [];
  }
};
