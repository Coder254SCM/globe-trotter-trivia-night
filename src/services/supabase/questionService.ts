
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";
import { QuestionToValidate } from "./questionValidationService";
import { QuestionFetcher } from "./question/questionFetcher";
import { QuestionStatsService } from "./question/questionStats";

// Re-export types for backward compatibility
export type { Question } from "./question/questionTypes";

export class QuestionService {
  // Enhanced question fetching operations
  static getQuestions = QuestionFetcher.getQuestions;
  static getFilteredQuestions = QuestionFetcher.getFilteredQuestions;
  static transformToFrontendQuestion = QuestionFetcher.transformToFrontendQuestion;

  // Statistics operations
  static getCountryStats = QuestionStatsService.getCountryStats;
  static getGlobalStats = QuestionStatsService.getGlobalStats;

  /**
   * Basic question validation
   */
  static validateQuestion(question: any): boolean {
    if (!question.text || question.text.length < 20) return false;
    
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];
    if (!options.includes(question.correct_answer)) return false;
    
    const uniqueOptions = new Set(options.map(opt => opt?.toLowerCase().trim()));
    if (uniqueOptions.size < 4) return false;
    
    return true;
  }

  /**
   * Saves questions to the database.
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    console.log(`Saving ${questions.length} questions...`);

    if (questions.length === 0) {
      console.log("No questions to save.");
      return;
    }

    // Use upsert to avoid duplicate questions if regeneration is attempted
    const { error } = await supabase.from('questions').upsert(questions, {
      onConflict: 'id',
    });

    if (error) {
      console.error('Failed to save questions:', error);
      throw error;
    }

    console.log(`✅ Successfully saved ${questions.length} questions.`);
  }
}
