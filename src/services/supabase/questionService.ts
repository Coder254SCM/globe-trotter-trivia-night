
import { Question as FrontendQuestion } from "@/types/quiz";
import { QuestionToValidate } from "./questionValidationService";
import { QuestionFetcher } from "./question/questionFetcher";
import { QuestionSaver } from "./question/questionSaver";
import { QuestionStatsService } from "./question/questionStats";

// Re-export types for backward compatibility
export type { Question } from "./question/questionTypes";

export class QuestionService {
  // Enhanced question fetching operations
  static getQuestions = QuestionFetcher.getQuestions;
  static getFilteredQuestions = QuestionFetcher.getFilteredQuestions;
  static transformToFrontendQuestion = QuestionFetcher.transformToFrontendQuestion;

  // Question saving operations
  /**
   * Saves questions to the database.
   * This now properly calls QuestionSaver.saveQuestions to maintain the correct `this` context.
   */
  static saveQuestions(questions: any[]) {
    return QuestionSaver.saveQuestions(questions);
  }

  /**
   * Validates a question.
   * This now properly calls QuestionSaver.validateQuestion to maintain the correct `this` context.
   */
  static validateQuestion(question: any) {
    return QuestionSaver.validateQuestion(question);
  }

  // Statistics operations
  static getCountryStats = QuestionStatsService.getCountryStats;
  static getGlobalStats = QuestionStatsService.getGlobalStats;
}
