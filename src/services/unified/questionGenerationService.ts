
import { Question } from "@/types/quiz";
import { Country } from "../supabase/country/countryTypes";
import { QuestionService } from "../supabase/questionService";
import { getCountryInfo } from "../../utils/external/restCountriesApi";

export interface GenerationConfig {
  primaryMode: 'template' | 'ai' | 'hybrid';
  fallbackEnabled: boolean;
  validationLevel: 'strict' | 'moderate' | 'lenient';
  batchSize: number;
}

export interface GenerationResult {
  success: boolean;
  questionsGenerated: number;
  errors: string[];
  warnings: string[];
  timeTaken: number;
}

export class UnifiedQuestionGenerationService {
  private static readonly DEFAULT_CONFIG: GenerationConfig = {
    primaryMode: 'template',
    fallbackEnabled: true,
    validationLevel: 'strict',
    batchSize: 10
  };

  /**
   * Primary method for generating questions - uses template-based generation as default
   */
  static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string,
    config: Partial<GenerationConfig> = {}
  ): Promise<GenerationResult> {
    const startTime = Date.now();
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const result: GenerationResult = {
      success: false,
      questionsGenerated: 0,
      errors: [],
      warnings: [],
      timeTaken: 0
    };

    console.log(`🎯 [UnifiedService] Starting generation for ${country.name} (${difficulty}, ${category})`);

    try {
      // Always try template-based generation first (most reliable)
      const questions = await this.generateTemplateQuestions(country, difficulty, count, category);
      
      if (questions.length > 0) {
        await this.saveQuestions(questions, country);
        result.questionsGenerated = questions.length;
        result.success = true;
        console.log(`✅ [UnifiedService] Template generation successful: ${questions.length} questions`);
      } else {
        result.errors.push('Template generation produced no questions');
        
        // Fallback only if enabled and template failed
        if (finalConfig.fallbackEnabled) {
          console.log(`🔄 [UnifiedService] Attempting fallback generation...`);
          const fallbackQuestions = await this.generateFallbackQuestions(country, difficulty, count, category);
          
          if (fallbackQuestions.length > 0) {
            await this.saveQuestions(fallbackQuestions, country);
            result.questionsGenerated = fallbackQuestions.length;
            result.success = true;
            result.warnings.push('Used fallback generation method');
            console.log(`✅ [UnifiedService] Fallback generation successful: ${fallbackQuestions.length} questions`);
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Generation failed: ${errorMessage}`);
      console.error(`❌ [UnifiedService] Generation error:`, error);
    }

    result.timeTaken = Date.now() - startTime;
    return result;
  }

  /**
   * Template-based generation (primary, most reliable method)
   */
  private static async generateTemplateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Promise<Question[]> {
    const questions: Question[] = [];
    const externalData = await getCountryInfo(country.name);
    
    // Core reliable templates
    const templates = this.getReliableTemplates(country, difficulty, category, externalData);
    
    for (let i = 0; i < count && i < templates.length; i++) {
      const template = templates[i % templates.length];
      const question: Question = {
        id: `unified-${country.id}-${difficulty}-${category.toLowerCase()}-${Date.now()}-${i}`,
        type: 'multiple-choice',
        text: template.text,
        choices: template.options.map((option: string, index: number) => ({
          id: String.fromCharCode(97 + index),
          text: option,
          isCorrect: option === template.correct,
        })),
        category: category as any,
        explanation: template.explanation,
        difficulty: difficulty as any,
      };
      
      if (this.validateQuestion(question)) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  /**
   * Fallback generation method
   */
  private static async generateFallbackQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Promise<Question[]> {
    // Simple fallback templates as safety net
    const fallbackTemplates = [
      {
        text: `What continent is ${country.name} located in?`,
        correct: country.continent,
        options: [country.continent, "Europe", "Asia", "Africa"],
        explanation: `${country.name} is located in ${country.continent}.`
      },
      {
        text: `What is the capital of ${country.name}?`,
        correct: country.capital || "Unknown",
        options: [country.capital || "Unknown", "Paris", "London", "Berlin"],
        explanation: `The capital of ${country.name} is ${country.capital || "not specified"}.`
      }
    ];

    return fallbackTemplates.slice(0, count).map((template, index) => ({
      id: `fallback-${country.id}-${difficulty}-${Date.now()}-${index}`,
      type: 'multiple-choice' as const,
      text: template.text,
      choices: template.options.map((option: string, idx: number) => ({
        id: String.fromCharCode(97 + idx),
        text: option,
        isCorrect: option === template.correct,
      })),
      category: category as any,
      explanation: template.explanation,
      difficulty: difficulty as any,
    }));
  }

  /**
   * Get reliable, tested question templates
   */
  private static getReliableTemplates(
    country: Country,
    difficulty: string,
    category: string,
    externalData: any
  ) {
    const capital = externalData?.capital ?? country.capital ?? "the capital";
    const continent = country.continent;
    
    return [
      {
        text: `What is the capital city of ${country.name}?`,
        correct: capital,
        options: [capital, "Paris", "Berlin", "Madrid"],
        explanation: `${capital} is the capital of ${country.name}.`
      },
      {
        text: `Which continent is ${country.name} located in?`,
        correct: continent,
        options: [continent, "Europe", "Asia", "Africa"],
        explanation: `${country.name} is located in ${continent}.`
      },
      {
        text: `${country.name} is a country in which region?`,
        correct: continent,
        options: [continent, "Antarctica", "Oceania", "North America"],
        explanation: `${country.name} is part of the ${continent} continent.`
      }
    ];
  }

  /**
   * Simplified validation - single point of truth
   */
  private static validateQuestion(question: Question): boolean {
    // Basic validation checks
    if (!question.text || question.text.length < 10) return false;
    if (!question.choices || question.choices.length !== 4) return false;
    if (!question.choices.some(choice => choice.isCorrect)) return false;
    
    // Check for placeholder content
    const allText = [question.text, ...question.choices.map(c => c.text)].join(' ').toLowerCase();
    const placeholders = ['placeholder', 'option a for', 'option b for', 'methodology', 'approach'];
    
    return !placeholders.some(placeholder => allText.includes(placeholder));
  }

  /**
   * Unified save method
   */
  private static async saveQuestions(questions: Question[], country: Country): Promise<void> {
    const currentMonth = new Date().getMonth() + 1;
    const questionsToInsert = questions.map(q => ({
      id: q.id,
      country_id: country.id,
      text: q.text,
      option_a: q.choices[0]?.text || '',
      option_b: q.choices[1]?.text || '',
      option_c: q.choices[2]?.text || '',
      option_d: q.choices[3]?.text || '',
      correct_answer: q.choices.find(c => c.isCorrect)?.text || '',
      difficulty: q.difficulty,
      category: q.category,
      explanation: q.explanation,
      month_rotation: currentMonth,
      ai_generated: false
    }));

    await QuestionService.saveQuestions(questionsToInsert);
  }
}
