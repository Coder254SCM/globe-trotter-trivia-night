
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
  static saveQuestions = QuestionSaver.saveQuestions;
  static validateQuestion = QuestionSaver.validateQuestion;

  // Statistics operations
  static getCountryStats = QuestionStatsService.getCountryStats;
  static getGlobalStats = QuestionStatsService.getGlobalStats;
}
