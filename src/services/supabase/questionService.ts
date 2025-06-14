
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";
import { QuestionValidationService, QuestionToValidate } from "./questionValidationService";

export interface Question {
  id: string;
  country_id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard'; // Now supports all three difficulty levels
  category: string;
  explanation?: string;
  month_rotation?: number;
  ai_generated?: boolean;
  image_url?: string;
}

export class QuestionService {
  /**
   * Get questions for a specific country (supports all difficulty levels)
   */
  static async getQuestions(
    countryId: string, 
    difficulty?: string, 
    limit: number = 10
  ): Promise<FrontendQuestion[]> {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('country_id', countryId);

      // Support all difficulty levels
      if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query
        .order('month_rotation')
        .limit(limit);

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      return (data || []).map(q => this.transformToFrontendQuestion(q));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      throw error;
    }
  }

  /**
   * Enhanced save with strict validation - accepts all difficulty levels
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    try {
      console.log(`🔍 Starting ENHANCED save operation for ${questions.length} questions...`);
      
      if (!questions || questions.length === 0) {
        console.log('📝 No questions to save');
        return;
      }
      
      // Enhanced filtering with strict validation - supports all difficulties
      const validQuestions = [];
      
      for (const q of questions) {
        // Basic structure validation
        const hasRequiredFields = q.text && 
                                 q.option_a && 
                                 q.option_b && 
                                 q.option_c && 
                                 q.option_d && 
                                 q.correct_answer &&
                                 q.country_id &&
                                 q.category &&
                                 ['easy', 'medium', 'hard'].includes(q.difficulty);
        
        if (!hasRequiredFields) {
          console.warn('⚠️ Skipping question with missing fields or invalid difficulty:', q.text?.substring(0, 50) + '...');
          continue;
        }
        
        // Enhanced validation using validation service
        const validationResult = await QuestionValidationService.preValidateQuestion(q);
        if (!validationResult.isValid || validationResult.severity === 'critical') {
          console.warn('❌ Question failed enhanced validation:', validationResult.issues.join(', '));
          console.warn('   Question text:', q.text?.substring(0, 100) + '...');
          continue;
        }
        
        validQuestions.push(q);
      }

      if (validQuestions.length === 0) {
        console.warn('⚠️ No valid questions found after enhanced filtering');
        return;
      }

      console.log(`✅ ${validQuestions.length} questions passed enhanced validation (rejected ${questions.length - validQuestions.length} for quality issues)`);

      // Save with smaller batches to prevent rate limiting
      const batchSize = 15;
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < validQuestions.length; i += batchSize) {
        const batch = validQuestions.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('questions')
            .upsert(batch, { 
              onConflict: 'id',
              ignoreDuplicates: false 
            });

          if (error) {
            console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error);
            throw new Error(`Database save failed: ${error.message}`);
          }
          
          console.log(`✅ Saved batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(validQuestions.length / batchSize)} (${batch.length} questions)`);
          
          // Add delay between batches
          if (i + batchSize < validQuestions.length) {
            await delay(750);
          }
          
        } catch (batchError) {
          console.error(`❌ Failed to save batch starting at index ${i}:`, batchError);
          throw batchError;
        }
      }

      console.log(`🎉 Successfully saved all ${validQuestions.length} high-quality questions to Supabase`);
      
    } catch (error) {
      console.error('❌ Enhanced save operation failed:', error);
      throw error;
    }
  }

  /**
   * Validate a single question before saving - accepts all difficulty levels
   */
  static async validateQuestion(question: QuestionToValidate): Promise<boolean> {
    try {
      // Validate difficulty level
      if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
        console.warn('❌ Invalid difficulty level - must be easy, medium, or hard');
        return false;
      }
      
      const result = await QuestionValidationService.preValidateQuestion(question);
      const isValid = result.isValid && result.severity !== 'critical';
      
      if (!isValid) {
        console.warn('❌ Question validation failed:', result.issues.join(', '));
      }
      
      return isValid;
    } catch (error) {
      console.error('❌ Question validation failed:', error);
      return false;
    }
  }

  /**
   * Transform Supabase question to frontend format
   */
  static transformToFrontendQuestion(supabaseQuestion: any): FrontendQuestion {
    return {
      id: supabaseQuestion.id,
      type: 'multiple-choice',
      text: supabaseQuestion.text,
      imageUrl: supabaseQuestion.image_url,
      choices: [
        { id: 'a', text: supabaseQuestion.option_a, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_a },
        { id: 'b', text: supabaseQuestion.option_b, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_b },
        { id: 'c', text: supabaseQuestion.option_c, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_c },
        { id: 'd', text: supabaseQuestion.option_d, isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_d }
      ],
      category: supabaseQuestion.category,
      explanation: supabaseQuestion.explanation || '',
      difficulty: supabaseQuestion.difficulty as 'easy' | 'medium' | 'hard'
    };
  }
}
