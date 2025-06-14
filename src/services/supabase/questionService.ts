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
   * Save questions to Supabase with MANDATORY validation
   * ALL QUESTIONS MUST PASS VALIDATION - NO EXCEPTIONS
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    try {
      console.log(`🔍 MANDATORY VALIDATION: Pre-validating ALL ${questions.length} questions...`);
      
      // Ensure no easy questions are being saved
      const filteredQuestions = questions.filter(q => q.difficulty !== 'easy');
      if (filteredQuestions.length !== questions.length) {
        console.warn(`⚠️ Filtered out ${questions.length - filteredQuestions.length} easy questions`);
      }
      
      if (filteredQuestions.length === 0) {
        console.log('📝 No valid questions to save after filtering out easy questions');
        return;
      }
      
      // Convert to validation format
      const questionsToValidate: QuestionToValidate[] = filteredQuestions.map(q => ({
        text: q.text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        country_id: q.country_id,
        category: q.category
      }));

      // MANDATORY validation - all questions must pass
      const validationResults = await QuestionValidationService.batchValidateQuestions(questionsToValidate);

      // REJECT ANY QUESTIONS WITH CRITICAL ISSUES
      if (validationResults.criticalIssues > 0) {
        const criticalQuestions = validationResults.results
          .filter(r => r.severity === 'critical')
          .map(r => `Question ${r.questionIndex + 1}: ${r.issues.join(', ')}`)
          .join('\n');
        
        throw new Error(`❌ VALIDATION FAILED: ${validationResults.criticalIssues} questions have CRITICAL issues and cannot be saved:\n${criticalQuestions}`);
      }

      // REJECT ANY INVALID QUESTIONS
      if (validationResults.validQuestions !== validationResults.totalQuestions) {
        const invalidQuestions = validationResults.results
          .filter(r => !r.isValid)
          .map(r => `Question ${r.questionIndex + 1}: ${r.issues.join(', ')}`)
          .join('\n');
        
        throw new Error(`❌ VALIDATION FAILED: ${validationResults.totalQuestions - validationResults.validQuestions} questions are invalid:\n${invalidQuestions}`);
      }

      console.log(`✅ VALIDATION PASSED: All ${validationResults.validQuestions} questions are valid and safe to save`);

      // Save to database (database triggers will provide additional validation)
      const { error } = await supabase
        .from('questions')
        .upsert(filteredQuestions, { onConflict: 'id' });

      if (error) {
        console.error('❌ Database save failed:', error);
        throw new Error(`Database save failed: ${error.message}`);
      }

      console.log(`✅ SUCCESS: Saved ${filteredQuestions.length} validated questions to Supabase (no easy questions)`);
    } catch (error) {
      console.error('❌ MANDATORY VALIDATION FAILED:', error);
      throw error;
    }
  }

  /**
   * Validate a single question before saving - MANDATORY CHECK
   */
  static async validateQuestion(question: QuestionToValidate): Promise<boolean> {
    try {
      const result = await QuestionValidationService.preValidateQuestion(question);
      
      // STRICT: Question must be valid AND not have critical issues
      const isValid = result.isValid && result.severity !== 'critical';
      
      if (!isValid) {
        console.warn(`⚠️ Question validation failed:`, result.issues);
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
      difficulty: supabaseQuestion.difficulty as 'medium' | 'hard' // Only medium/hard allowed
    };
  }
}
