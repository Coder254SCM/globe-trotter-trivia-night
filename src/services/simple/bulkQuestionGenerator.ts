
import { Country } from "../supabase/country/countryTypes";
import { generateAndSaveQuestions } from "./templateQuestionGenerator";

export class BulkQuestionGenerator {
  static async generateForAllCountries(
    countries: Country[],
    questionsPerCountry: number = 50
  ): Promise<void> {
    console.log(`🚀 Starting bulk generation for ${countries.length} countries`);
    
    const batchSize = 3; // Process 3 countries at a time
    let completed = 0;
    
    for (let i = 0; i < countries.length; i += batchSize) {
      const batch = countries.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (country) => {
        try {
          // Generate for all difficulties
          await generateAndSaveQuestions(country, 'easy', questionsPerCountry);
          await generateAndSaveQuestions(country, 'medium', questionsPerCountry);
          await generateAndSaveQuestions(country, 'hard', questionsPerCountry);
          
          completed++;
          console.log(`✅ Completed ${completed}/${countries.length}: ${country.name}`);
        } catch (error) {
          console.error(`❌ Failed to generate questions for ${country.name}:`, error);
        }
      }));
      
      // Small delay between batches to prevent overwhelming the database
      if (i + batchSize < countries.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`🎉 Bulk generation completed! Processed ${completed}/${countries.length} countries`);
  }
  
  static async generateForCountry(
    country: Country,
    questionsPerCountry: number = 50
  ): Promise<void> {
    console.log(`🎯 Generating questions for ${country.name}`);
    
    try {
      // Generate for all difficulties
      await generateAndSaveQuestions(country, 'easy', questionsPerCountry);
      await generateAndSaveQuestions(country, 'medium', questionsPerCountry);
      await generateAndSaveQuestions(country, 'hard', questionsPerCountry);
      
      console.log(`✅ Successfully generated questions for ${country.name}`);
    } catch (error) {
      console.error(`❌ Failed to generate questions for ${country.name}:`, error);
      throw error;
    }
  }
}
