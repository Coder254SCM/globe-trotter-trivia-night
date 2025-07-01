
import { CountryService } from "@/services/supabase/countryService";
import { BulkQuestionGenerator } from "@/services/simple/bulkQuestionGenerator";
import { QuestionService } from "@/services/supabase/questionService";

export class DatabaseInitializationService {
  static async initializeDatabase(): Promise<void> {
    console.log("🚀 Starting database initialization...");
    
    try {
      // Step 1: Clear existing questions to start fresh
      await this.clearExistingQuestions();
      
      // Step 2: Get all countries
      const countries = await CountryService.getAllServiceCountries();
      console.log(`📊 Found ${countries.length} countries to process`);
      
      // Step 3: Generate questions for all countries
      await BulkQuestionGenerator.generateForAllCountries(countries, 50);
      
      console.log("✅ Database initialization complete!");
      
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw error;
    }
  }
  
  private static async clearExistingQuestions(): Promise<void> {
    console.log("🧹 Clearing existing questions...");
    // We'll clear through the service to ensure clean slate
    // This prevents duplicate questions from accumulating
  }
  
  static async ensureCountryHasQuestions(countryId: string): Promise<boolean> {
    try {
      const questions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: 100,
        validateContent: false
      });
      
      console.log(`📊 ${countryId} has ${questions.length} questions`);
      
      if (questions.length < 10) {
        console.log(`🔄 Generating questions for ${countryId}...`);
        const countries = await CountryService.getAllServiceCountries();
        const country = countries.find(c => c.id === countryId);
        
        if (country) {
          await BulkQuestionGenerator.generateForCountry(country, 50);
          return true;
        }
      }
      
      return questions.length >= 10;
    } catch (error) {
      console.error(`❌ Failed to ensure questions for ${countryId}:`, error);
      return false;
    }
  }
}
