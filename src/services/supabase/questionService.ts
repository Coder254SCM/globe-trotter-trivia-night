
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
  difficulty: 'medium' | 'hard'; // Removed easy from valid difficulties
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
        .eq('country_id', countryId)
        .neq('difficulty', 'easy'); // Explicitly exclude easy questions

      // Only allow medium and hard difficulties
      if (difficulty && (difficulty === 'medium' || difficulty === 'hard')) {
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

      // Transform Supabase questions to frontend format
      return (data || []).map(q => this.transformToFrontendQuestion(q));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      throw error;
    }
  }

  /**
   * Save questions to Supabase with validation
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    try {
      console.log(`🔍 Validating ${questions.length} questions before save...`);
      
      // Ensure no easy questions are being saved
      const filteredQuestions = questions.filter(q => q.difficulty !== 'easy');
      if (filteredQuestions.length !== questions.length) {
        console.warn(`⚠️ Filtered out ${questions.length - filteredQuestions.length} easy questions`);
      }
      
      if (filteredQuestions.length === 0) {
        console.log('📝 No valid questions to save after filtering');
        return;
      }
      
      // Basic validation before save
      const validQuestions = filteredQuestions.filter(q => {
        return q.text && 
               q.option_a && 
               q.option_b && 
               q.option_c && 
               q.option_d && 
               q.correct_answer &&
               q.country_id &&
               q.category &&
               (q.difficulty === 'medium' || q.difficulty === 'hard');
      });

      if (validQuestions.length === 0) {
        throw new Error('No valid questions found after basic validation');
      }

      console.log(`✅ ${validQuestions.length} questions passed basic validation`);

      // Save to database
      const { error } = await supabase
        .from('questions')
        .upsert(validQuestions, { onConflict: 'id' });

      if (error) {
        console.error('❌ Database save failed:', error);
        throw new Error(`Database save failed: ${error.message}`);
      }

      console.log(`✅ Successfully saved ${validQuestions.length} questions to Supabase`);
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
