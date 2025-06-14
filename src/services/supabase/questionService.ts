
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
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
  month_rotation?: number;
  ai_generated?: boolean;
  image_url?: string;
}

export class QuestionService {
  /**
   * Get questions for a specific country and difficulty
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

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
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
      // Pre-validate all questions before attempting to save
      const questionsToValidate: QuestionToValidate[] = questions.map(q => ({
        text: q.text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        country_id: q.country_id,
        category: q.category
      }));

      console.log(`🔍 Pre-validating ${questions.length} questions...`);
      const validationResults = await QuestionValidationService.batchValidateQuestions(questionsToValidate);

      if (validationResults.criticalIssues > 0) {
        const criticalQuestions = validationResults.results
          .filter(r => r.severity === 'critical')
          .map(r => `Question ${r.questionIndex + 1}: ${r.issues.join(', ')}`)
          .join('\n');
        
        throw new Error(`❌ ${validationResults.criticalIssues} questions have critical issues:\n${criticalQuestions}`);
      }

      if (validationResults.validQuestions !== validationResults.totalQuestions) {
        console.warn(`⚠️ ${validationResults.totalQuestions - validationResults.validQuestions} questions have non-critical issues but will be saved`);
      }

      console.log(`✅ Validation passed. Saving ${validationResults.validQuestions} valid questions...`);

      const { error } = await supabase
        .from('questions')
        .upsert(questions, { onConflict: 'id' });

      if (error) {
        console.error('Error saving questions:', error);
        throw error;
      }

      console.log(`✅ Successfully saved ${questions.length} questions to Supabase`);
    } catch (error) {
      console.error('Failed to save questions:', error);
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
      console.error('Question validation failed:', error);
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
