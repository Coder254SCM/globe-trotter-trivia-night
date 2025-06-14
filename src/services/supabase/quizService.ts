
import { Country as FrontendCountry } from "@/types/quiz";
import { CountryService } from "./countryService";
import { QuestionService } from "./questionService";
import { GameService } from "./gameService";
import { AuditService } from "./auditService";
import { TemplateService } from "./templateService";

// Re-export types for backward compatibility
export type { Country } from "./countryService";
export type { Question } from "./question/questionTypes";
export type { AuditResult } from "./auditService";

export class QuizService {
  // Country operations
  static getAllCountries = CountryService.getAllCountries;
  static populateAllCountries = CountryService.populateAllCountries;
  static getDatabaseStats = CountryService.getDatabaseStats;

  // Question operations
  static getQuestions = QuestionService.getQuestions;
  static saveQuestions = QuestionService.saveQuestions;

  // Game operations
  static getFailedQuestions = GameService.getFailedQuestions;
  static getLeaderboard = GameService.getLeaderboard;

  // Audit operations
  static auditQuestions = AuditService.auditQuestions;

  // Template operations
  static generateEasyQuestionsForCountry = TemplateService.generateEasyQuestionsForCountry;

  /**
   * Generate questions for all countries - FIXED METHOD
   */
  static async generateQuestionsForAllCountries(questionsPerDifficulty: number = 20): Promise<void> {
    const countries = await CountryService.getAllCountries();
    console.log(`📝 Generating ${questionsPerDifficulty} questions per difficulty for ${countries.length} countries...`);
    
    for (const country of countries) {
      await TemplateService.generateEasyQuestionsForCountry(country, questionsPerDifficulty);
    }
    
    console.log('✅ Completed generating questions for all countries');
  }

  /**
   * Generate questions for a specific country - FIXED METHOD
   */
  static async generateQuestionsForCountry(country: FrontendCountry, questionsPerDifficulty: number = 20): Promise<void> {
    await TemplateService.generateEasyQuestionsForCountry(country, questionsPerDifficulty);
  }

  /**
   * Initialize complete production database
   */
  static async initializeProductionDatabase(): Promise<void> {
    console.log('🚀 PRODUCTION: Initializing complete database...');
    
    // Step 1: Populate all countries
    await CountryService.populateAllCountries();
    
    // Step 2: Generate easy questions for all countries and categories
    const countries = await CountryService.getAllCountries();
    console.log(`📝 PRODUCTION: Generating easy questions for ${countries.length} countries...`);
    
    for (const country of countries) {
      await TemplateService.generateEasyQuestionsForCountry(country, 10); // 10 questions per category = 50 per country
    }
    
    console.log('🎉 PRODUCTION: Database initialization complete!');
    console.log(`✅ ${countries.length} countries populated`);
    console.log(`✅ ${countries.length * 50} easy questions generated`);
    console.log('📋 Ready for medium/hard question generation');
  }
}
