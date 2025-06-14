
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
  difficulty: 'medium' | 'hard';
  category: string;
  explanation?: string;
  month_rotation?: number;
  ai_generated?: boolean;
  image_url?: string;
}

export class QuestionService {
  /**
   * Get questions for a specific country and difficulty (medium/hard only)
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

      // Only allow medium and hard difficulties - no easy questions exist anymore
      if (difficulty === 'medium' || difficulty === 'hard') {
        query = query.eq('difficulty', difficulty);
      } else {
        // Default to medium if no valid difficulty specified
        query = query.eq('difficulty', 'medium');
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
   * Save questions to Supabase with validation and rate limiting
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    try {
      console.log(`🔍 Starting save operation for ${questions.length} questions...`);
      
      if (!questions || questions.length === 0) {
        console.log('📝 No questions to save');
        return;
      }
      
      // Filter out any easy questions and validate
      const validQuestions = questions.filter(q => {
        const isValid = q.text && 
                       q.option_a && 
                       q.option_b && 
                       q.option_c && 
                       q.option_d && 
                       q.correct_answer &&
                       q.country_id &&
                       q.category &&
                       (q.difficulty === 'medium' || q.difficulty === 'hard'); // Only medium/hard allowed
        
        if (!isValid) {
          console.warn('⚠️ Skipping invalid question:', q.text?.substring(0, 50) + '...');
        }
        
        // Reject any easy questions
        if (q.difficulty === 'easy') {
          console.warn('❌ Rejecting easy question - not allowed:', q.text?.substring(0, 50) + '...');
          return false;
        }
        
        return isValid;
      });

      if (validQuestions.length === 0) {
        console.warn('⚠️ No valid medium/hard questions found after filtering');
        return;
      }

      console.log(`✅ ${validQuestions.length} medium/hard questions passed validation`);

      // Save with smaller batches to prevent rate limiting
      const batchSize = 20;
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
            await delay(500);
          }
          
        } catch (batchError) {
          console.error(`❌ Failed to save batch starting at index ${i}:`, batchError);
          throw batchError;
        }
      }

      console.log(`🎉 Successfully saved all ${validQuestions.length} medium/hard questions to Supabase`);
      
    } catch (error) {
      console.error('❌ Save operation failed:', error);
      throw error;
    }
  }

  /**
   * Validate a single question before saving
   */
  static async validateQuestion(question: QuestionToValidate): Promise<boolean> {
    try {
      // Reject easy questions immediately
      if (question.difficulty === 'easy') {
        console.warn('❌ Easy questions are not allowed');
        return false;
      }
      
      const result = await QuestionValidationService.preValidateQuestion(question);
      return result.isValid && result.severity !== 'critical';
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
      difficulty: supabaseQuestion.difficulty as 'medium' | 'hard'
    };
  }
}
