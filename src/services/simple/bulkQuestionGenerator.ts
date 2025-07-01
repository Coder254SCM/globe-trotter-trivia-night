
import { Country } from "../supabase/country/countryTypes";
import { generateAndSaveEnhancedQuestions } from "./improvedTemplateGenerator";

export class BulkQuestionGenerator {
  static async generateForAllCountries(
    countries: Country[],
    questionsPerCountry: number = 50
  ): Promise<void> {
    console.log(`🚀 Starting enhanced bulk generation for ${countries.length} countries`);
    
    const batchSize = 5; // Process 5 countries at a time
    let completed = 0;
    
    for (let i = 0; i < countries.length; i += batchSize) {
      const batch = countries.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (country) => {
        try {
          // Generate for all difficulties with enhanced templates
          await generateAndSaveEnhancedQuestions(country, 'easy', questionsPerCountry);
          await generateAndSaveEnhancedQuestions(country, 'medium', questionsPerCountry);
          await generateAndSaveEnhancedQuestions(country, 'hard', questionsPerCountry);
          
          completed++;
          console.log(`✅ Completed ${completed}/${countries.length}: ${country.name} (${questionsPerCountry * 3} questions)`);
        } catch (error) {
          console.error(`❌ Failed to generate questions for ${country.name}:`, error);
        }
      }));
      
      // Small delay between batches
      if (i + batchSize < countries.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`🎉 Enhanced bulk generation completed! Processed ${completed}/${countries.length} countries`);
  }
  
  static async generateForCountry(
    country: Country,
    questionsPerCountry: number = 50
  ): Promise<void> {
    console.log(`🎯 Generating enhanced questions for ${country.name}`);
    
    try {
      // Generate for all difficulties
      await generateAndSaveEnhancedQuestions(country, 'easy', questionsPerCountry);
      await generateAndSaveEnhancedQuestions(country, 'medium', questionsPerCountry);
      await generateAndSaveEnhancedQuestions(country, 'hard', questionsPerCountry);
      
      console.log(`✅ Successfully generated ${questionsPerCountry * 3} questions for ${country.name}`);
    } catch (error) {
      console.error(`❌ Failed to generate questions for ${country.name}:`, error);
      throw error;
    }
  }
}
