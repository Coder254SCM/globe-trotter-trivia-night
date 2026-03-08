
import { CountryService } from "@/services/supabase/countryService";
import { QuestionService } from "@/services/supabase/questionService";
import { generateAndSaveRealQuestions } from "@/services/simple/realQuestionGenerator";

export class DatabaseInitializationService {
  static async initializeDatabase(): Promise<void> {
    console.log("🚀 Starting database initialization with REAL data...");
    
    try {
      const countries = await CountryService.getAllServiceCountries();
      console.log(`📊 Found ${countries.length} countries to process`);
      
      let generated = 0;
      const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
      
      // Process in small batches to avoid overwhelming the DB
      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        
        for (const difficulty of difficulties) {
          const count = await generateAndSaveRealQuestions(
            { id: country.id, name: country.name, continent: country.continent, capital: country.capital },
            difficulty,
            5  // 5 questions per difficulty = 15 per country
          );
          generated += count;
        }
        
        if ((i + 1) % 20 === 0) {
          console.log(`✅ Completed ${i + 1}/${countries.length}: ${generated} total questions`);
        }
      }
      
      console.log(`✅ Database initialization complete! Generated ${generated} questions for ${countries.length} countries`);
      
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw error;
    }
  }
  
  static async ensureCountryHasQuestions(countryId: string): Promise<boolean> {
    try {
      const questions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: 100,
        validateContent: false
      });
      
      if (questions.length < 5) {
        console.log(`🔄 Generating real questions for ${countryId}...`);
        const countries = await CountryService.getAllServiceCountries();
        const country = countries.find(c => c.id === countryId);
        
        if (country) {
          const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
          for (const diff of difficulties) {
            await generateAndSaveRealQuestions(
              { id: country.id, name: country.name, continent: country.continent, capital: country.capital },
              diff,
              5
            );
          }
          return true;
        }
      }
      
      return questions.length >= 5;
    } catch (error) {
      console.error(`❌ Failed to ensure questions for ${countryId}:`, error);
      return false;
    }
  }
}
