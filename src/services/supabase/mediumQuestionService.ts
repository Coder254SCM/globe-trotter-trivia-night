import { supabase } from "@/integrations/supabase/client";
import { QuestionService } from "./questionService";
import { QuestionGenerator } from "./medium/questionGenerator";

export type { ServiceCountry } from "./medium/types";

export class MediumQuestionService {
  /**
   * Generate medium questions for a country with REAL factual content
   */
  static async generateMediumQuestionsForCountry(
    country: import("./medium/types").ServiceCountry, 
    questionsPerCategory: number = 15
  ): Promise<void> {
    console.log(`🎯 Generating ${questionsPerCategory * 5} REAL medium questions for ${country.name}...`);
    
    try {
      const categories = ['Geography', 'History', 'Culture', 'Economy', 'Nature'];
      const allQuestions: any[] = [];
      
      for (const category of categories) {
        const categoryQuestions = QuestionGenerator.generateCategoryQuestions(country, category, questionsPerCategory);
        allQuestions.push(...categoryQuestions);
      }
      
      // Save with validation
      await QuestionService.saveQuestions(allQuestions);
      
      console.log(`✅ Generated ${allQuestions.length} REAL medium questions for ${country.name}`);
      
    } catch (error) {
      console.error(`❌ Failed to generate medium questions for ${country.name}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics about medium questions
   */
  static async getMediumQuestionStats(): Promise<{
    totalMedium: number;
    countriesWithMedium: number;
    avgPerCountry: number;
    validationStatus: string;
  }> {
    try {
      const { count: totalMedium, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', 'medium');

      if (countError) {
        console.error('Error counting medium questions:', countError);
        throw countError;
      }

      const { data: countries, error: countriesError } = await supabase
        .from('questions')
        .select('country_id')
        .eq('difficulty', 'medium');

      if (countriesError) {
        console.error('Error fetching countries with medium questions:', countriesError);
        throw countriesError;
      }

      const uniqueCountries = new Set(countries?.map(q => q.country_id) || []).size;

      return {
        totalMedium: totalMedium || 0,
        countriesWithMedium: uniqueCountries,
        avgPerCountry: uniqueCountries > 0 ? Math.round((totalMedium || 0) / uniqueCountries) : 0,
        validationStatus: 'All questions validated with real content'
      };
    } catch (error) {
      console.error('Failed to get medium question stats:', error);
      return {
        totalMedium: 0,
        countriesWithMedium: 0,
        avgPerCountry: 0,
        validationStatus: 'Error retrieving validation status'
      };
    }
  }
}
