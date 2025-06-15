
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
   * Placeholder for saving questions - implement as needed
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    console.log(`Saving ${questions.length} questions...`);
    // Implementation would go here
  }
}
