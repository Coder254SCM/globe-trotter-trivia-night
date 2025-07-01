
import { Question } from "@/types/quiz";
import { Country } from "./supabase/country/countryTypes";
import { UnifiedQuestionGenerationService } from "./unified/questionGenerationService";
import { SystemMonitor } from "./monitoring/systemMonitor";

export class TemplateQuestionService {
  /**
   * @deprecated Use UnifiedQuestionGenerationService.generateQuestions instead
   * This method is kept for backward compatibility
   */
  public static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Promise<void> {
    console.log(`🔧 [TemplateService] Delegating to UnifiedQuestionGenerationService...`);
    
    try {
      const result = await UnifiedQuestionGenerationService.generateQuestions(
        country,
        difficulty,
        count,
        category,
        { primaryMode: 'template', fallbackEnabled: true }
      );

      // Record metrics
      if (result.success) {
        SystemMonitor.recordGeneration('template', result.timeTaken, result.questionsGenerated);
        console.log(`✅ [TemplateService] Successfully generated ${result.questionsGenerated} questions`);
      } else {
        SystemMonitor.recordGeneration('failed', result.timeTaken, 0);
        console.error(`❌ [TemplateService] Generation failed:`, result.errors);
        throw new Error(result.errors.join(', '));
      }

      if (result.warnings.length > 0) {
        console.warn(`⚠️ [TemplateService] Warnings:`, result.warnings);
      }
    } catch (error) {
      SystemMonitor.recordGeneration('failed', 0, 0);
      console.error(`❌ [TemplateService] Error generating questions for ${country.name}:`, error);
      throw error;
    }
  }

  /**
   * @deprecated Use UnifiedQuestionGenerationService.generateQuestions instead
   */
  public static async generateAllDifficulties(
    country: Country,
    category: string = 'Geography',
    questionsPerDifficulty: number = 5
  ): Promise<void> {
    console.log(`🎯 [TemplateService] Generating all difficulties for ${country.name} using unified service`);
    
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
