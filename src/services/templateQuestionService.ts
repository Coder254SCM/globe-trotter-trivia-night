
import { Question } from "@/types/quiz";
import { Country } from "./supabase/country/countryTypes";
import { buildValidQuestions } from "./template/questionBuilder";
import { saveQuestionsToSupabase } from "./template/databaseSaver";

export class TemplateQuestionService {
  public static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Promise<void> {
    console.log(`🔧 [TemplateService] Generating ${count} ${difficulty} questions for ${country.name} in category ${category}`);
    
    try {
      const questions = buildValidQuestions(country, difficulty, count, category);

      if (questions.length > 0) {
        console.log(`👉 [TemplateService] Generated ${questions.length} valid questions for ${country.name}:`);
        questions.forEach(q => {
          console.log(`- ${q.text.substring(0, 60)}... [${q.category}, ${q.difficulty}]`);
        });
        
        await saveQuestionsToSupabase(questions, country, difficulty);
        console.log(`✅ [TemplateService] Successfully saved ${questions.length} questions for ${country.name}`);
      } else {
        console.log(`❌ [TemplateService] No valid questions generated for ${country.name} (${difficulty}, ${category})`);
      }
    } catch (error) {
      console.error(`❌ [TemplateService] Error generating questions for ${country.name}:`, error);
      throw error;
    }
  }

  /**
   * Generate questions for all difficulties for a country
   */
  public static async generateAllDifficulties(
    country: Country,
    category: string = 'Geography',
    questionsPerDifficulty: number = 5
  ): Promise<void> {
    console.log(`🎯 [TemplateService] Generating all difficulties for ${country.name}`);
    
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    for (const difficulty of difficulties) {
      try {
        await this.generateQuestions(country, difficulty, questionsPerDifficulty, category);
      } catch (error) {
        console.error(`❌ [TemplateService] Failed to generate ${difficulty} questions for ${country.name}:`, error);
      }
    }
    
    console.log(`✅ [TemplateService] Completed generation for all difficulties for ${country.name}`);
  }
}
