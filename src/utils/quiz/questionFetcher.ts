
import { Question } from "../../types/quiz";
import { runStartupAudit, isAuditCompleted } from "./auditRunner";
import { aggregateQuestions, processQuestionPool } from "./questionAggregator";
import { 
  hasQuestionsForCountry,
  getQuestionCountForCountry,
  getRecentlyUpdatedQuestions,
  getQuestionsByDifficulty,
  getQuestionAuditResults,
  getCountryRelevanceScore
} from "./questionStats";
import { QuestionService } from "@/services/supabase/questionService";
import { FactualQuizService } from "@/services/factual/factualQuizService";

// Main question fetching function with improved error handling
export const getQuizQuestions = async (
  countryId?: string,
  continentId?: string,
  count: number = 10,
  includeGlobal: boolean = true,
  difficulty?: string
): Promise<Question[]> => {
  console.log(`🔍 Fetching quiz questions:`, { countryId, difficulty, count });
  
  if (!isAuditCompleted()) {
    runStartupAudit();
  }
  
  try {
    // First try to get questions from Supabase
    if (countryId) {
      console.log(`📋 Fetching from Supabase for country: ${countryId}, difficulty: ${difficulty}`);
      
      const supabaseQuestions = await QuestionService.getQuestions(
        countryId, 
        difficulty, 
        count
      );
      
      if (supabaseQuestions.length >= count) {
        console.log(`✅ Found ${supabaseQuestions.length} questions from Supabase (enough)`);
        return supabaseQuestions.slice(0, count);
      }

      if (supabaseQuestions.length > 0) {
        console.log(`ℹ️ Only ${supabaseQuestions.length}/${count} found. Topping up with factual generator...`);
        try {
          const missing = count - supabaseQuestions.length;
          await FactualQuizService.cleanAndGenerateQuestions(
            countryId,
            (difficulty as 'easy' | 'medium' | 'hard') || 'medium',
            missing
          );
          const topped = await QuestionService.getQuestions(countryId, difficulty, count);
          if (topped.length >= count) return topped.slice(0, count);
          if (topped.length > supabaseQuestions.length) return topped;
        } catch (e) {
          console.warn('⚠️ Top-up generation failed:', e);
        }
      }
      
      // Fallback: try without difficulty filter
      if (difficulty) {
        console.log(`🔄 Retrying without difficulty filter...`);
        const fallbackQuestions = await QuestionService.getQuestions(
          countryId, 
          undefined, 
          count
        );
        
        if (fallbackQuestions.length >= count) {
          console.log(`✅ Found ${fallbackQuestions.length} fallback questions (enough)`);
          return fallbackQuestions.slice(0, count);
        }
        
        if (fallbackQuestions.length > 0) {
          console.log(`ℹ️ Only ${fallbackQuestions.length}/${count} fallback found. Topping up...`);
          try {
            const missing = count - fallbackQuestions.length;
            await FactualQuizService.cleanAndGenerateQuestions(countryId, 'medium', missing);
            const topped = await QuestionService.getQuestions(countryId, undefined, count);
            if (topped.length >= count) return topped.slice(0, count);
            if (topped.length > fallbackQuestions.length) return topped;
          } catch (e) {
            console.warn('⚠️ Fallback top-up failed:', e);
          }
        }
      }
    }
    
    // Fallback to aggregated questions
    console.log(`🔄 Falling back to aggregated questions...`);
    const questionPool = await aggregateQuestions(
      countryId, 
      continentId, 
      count * 2, // Request more to account for filtering
      difficulty
    );
    
    // Process and filter the question pool
    const processedQuestions = processQuestionPool(questionPool, count);
    
    if (processedQuestions.length === 0) {
      console.warn(`⚠️ No questions found for country: ${countryId}, difficulty: ${difficulty}`);
      
      // Final fallback: try any questions for the country
      if (countryId) {
        console.log(`🔄 Final fallback: any questions for ${countryId}...`);
        const anyQuestions = await aggregateQuestions(countryId, undefined, count * 3);
        return processQuestionPool(anyQuestions, count);
      }
    }
    
    console.log(`✅ Returning ${processedQuestions.length} processed questions`);
    return processedQuestions;
  } catch (error) {
    console.error('💥 Error fetching quiz questions:', error);
    
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

// Re-export utility functions
export {
  hasQuestionsForCountry,
  getQuestionCountForCountry,
  getRecentlyUpdatedQuestions,
  getQuestionsByDifficulty,
  getQuestionAuditResults,
  getCountryRelevanceScore
};
