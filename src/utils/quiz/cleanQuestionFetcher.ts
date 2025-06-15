
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";

/**
 * Enhanced clean question fetcher with better error handling and fallbacks
 */
export const getCleanQuizQuestions = async (
  countryId: string,
  difficulty: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🔍 [CleanFetcher] Fetching ${count} ${difficulty} questions for countryId: ${countryId}`);
  
  try {
    // First try with exact difficulty match
    let questions = await QuestionService.getFilteredQuestions({
      countryId,
      difficulty,
      limit: count,
      validateContent: true
    });

    console.log(`📋 [CleanFetcher] Found ${questions.length} questions with exact difficulty match`);

    // If we don't have enough questions, try without difficulty filter
    if (questions.length < count) {
      console.log(`🔄 [CleanFetcher] Not enough questions, trying without difficulty filter...`);
      
      const fallbackQuestions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: count,
        validateContent: true
      });
      
      console.log(`📋 [CleanFetcher] Found ${fallbackQuestions.length} fallback questions`);
      questions = fallbackQuestions;
    }

    // If still no questions, try any questions for this country
    if (questions.length === 0) {
      console.log(`🔄 [CleanFetcher] Still no questions, trying basic fetch...`);
      
      const basicQuestions = await QuestionService.getQuestions(countryId, undefined, count);
      console.log(`📋 [CleanFetcher] Found ${basicQuestions.length} basic questions`);
      questions = basicQuestions;
    }

    console.log(`✅ [CleanFetcher] Returning ${questions.length} validated questions`);
    return questions;

  } catch (error) {
    console.error('❌ [CleanFetcher] Error fetching clean questions:', error);
    
    // Final fallback - try basic service
    try {
      const emergencyQuestions = await QuestionService.getQuestions(countryId, undefined, count);
      console.log(`🚨 [CleanFetcher] Emergency fallback returned ${emergencyQuestions.length} questions`);
      return emergencyQuestions;
    } catch (fallbackError) {
      console.error('❌ [CleanFetcher] Even emergency fallback failed:', fallbackError);
      return [];
    }
  }
};
