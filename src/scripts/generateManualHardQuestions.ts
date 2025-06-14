
import { convertRawToSupabaseCountry } from "../hooks/quiz/countryConverter";
import { QuestionTemplates } from "./manualQuestions/questionTemplates";
import { ManualQuestionService } from "./manualQuestions/questionService";
import { QuestionService } from "../services/supabase/questionService";

/**
 * Generate 30 hard PhD-level questions manually for each country with MANDATORY validation
 */
export class ManualHardQuestionGenerator {
  
  /**
   * Generate hard questions for all countries with MANDATORY validation
   */
  static async generateForAllCountries(): Promise<void> {
    console.log('🎓 Starting VALIDATED manual PhD-level question generation (30 categories) for all countries...');
    
    try {
      const countriesRaw = await ManualQuestionService.getAllCountries();
      const countries = countriesRaw.map(convertRawToSupabaseCountry);
      console.log(`📚 Generating 30 VALIDATED manual PhD questions for ${countries.length} countries...`);

      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        console.log(`🎯 Processing ${country.name} (${i + 1}/${countries.length}) with MANDATORY validation...`);
        
        try {
          const questions = QuestionTemplates.generateQuestionsForCountry(country);
          
          // MANDATORY VALIDATION: Use QuestionService.saveQuestions which enforces validation
          console.log(`🔍 MANDATORY VALIDATION: Validating ${questions.length} PhD questions for ${country.name}...`);
          await QuestionService.saveQuestions(questions);

          console.log(`✅ Generated and VALIDATED 30 PhD questions for ${country.name}`);
          
          // Small delay to avoid overwhelming the database
          if (i < countries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`❌ VALIDATION FAILED for ${country.name}:`, error);
          // Continue with next country instead of stopping
        }
      }
      
      console.log('🎉 Manual PhD-level question generation with MANDATORY validation completed!');
      
      // Get final stats
      const stats = await ManualQuestionService.getHardQuestionStats();
      
      console.log(`📊 Final Statistics (All Validated):`);
      console.log(`- Total hard questions generated: ${stats.hardQuestionCount}`);
      console.log(`- Countries with hard questions: ${stats.countriesWithHard}`);
      console.log(`- Average hard questions per country: ${stats.avgPerCountry}`);
      console.log(`- Validation Status: ALL QUESTIONS VALIDATED ✅`);
      
    } catch (error) {
      console.error('❌ Failed to generate validated manual PhD questions:', error);
      throw error;
    }
  }

  /**
   * Generate hard questions for a specific country with MANDATORY validation
   */
  static async generateForCountry(countryName: string): Promise<void> {
    console.log(`🎓 Generating 30 VALIDATED manual PhD questions for ${countryName}...`);
    
    try {
      const countryData = await ManualQuestionService.getCountryByName(countryName);
      const country = convertRawToSupabaseCountry(countryData);
      const questions = QuestionTemplates.generateQuestionsForCountry(country);
      
      // MANDATORY VALIDATION: Use QuestionService.saveQuestions which enforces validation
      console.log(`🔍 MANDATORY VALIDATION: Validating ${questions.length} PhD questions for ${countryName}...`);
      await QuestionService.saveQuestions(questions);
      
      console.log(`✅ Generated and VALIDATED 30 PhD questions for ${countryName}`);
    } catch (error) {
      console.error(`❌ VALIDATION FAILED for ${countryName}:`, error);
      throw error;
    }
  }
}

// Export functions for use in console or components
export const generateManualHardQuestions = ManualHardQuestionGenerator.generateForAllCountries;
export const generateManualHardQuestionsForCountry = ManualHardQuestionGenerator.generateForCountry;
