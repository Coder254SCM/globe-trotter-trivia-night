
import { supabase } from "@/integrations/supabase/client";
import { QuestionValidationService } from "./questionValidationService";

/**
 * Service to enforce validation rules and clean up invalid questions
 */
export class ValidationEnforcementService {
  
  /**
   * NUCLEAR OPTION: Delete all questions with placeholder content
   */
  static async deleteAllPlaceholderQuestions(): Promise<{ deleted: number; errors: string[] }> {
    console.log('🚨 ENFORCING VALIDATION: Deleting all placeholder questions...');
    
    try {
      // Get all questions for validation
      const { data: questions, error: fetchError } = await supabase
        .from('questions')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      if (!questions?.length) {
        return { deleted: 0, errors: [] };
      }

      const questionsToDelete = [];
      const errors = [];

      // Check each question for placeholder content
      for (const question of questions) {
        // Ensure difficulty is properly typed before validation
        const questionToValidate = {
          ...question,
          difficulty: question.difficulty as 'easy' | 'medium' | 'hard'
        };
        
        const validation = await QuestionValidationService.preValidateQuestion(questionToValidate);
        
        // Delete if validation fails or has critical issues
        if (!validation.isValid || validation.severity === 'critical') {
          questionsToDelete.push(question.id);
          console.log(`🗑️ Marking for deletion: ${question.text?.substring(0, 50)}... - ${validation.issues.join(', ')}`);
        }
      }

      if (questionsToDelete.length === 0) {
        console.log('✅ No placeholder questions found to delete');
        return { deleted: 0, errors: [] };
      }

      // Delete in batches to avoid timeout
      const batchSize = 100;
      let totalDeleted = 0;

      for (let i = 0; i < questionsToDelete.length; i += batchSize) {
        const batch = questionsToDelete.slice(i, i + batchSize);
        
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .in('id', batch);

        if (deleteError) {
          errors.push(`Batch ${i / batchSize + 1}: ${deleteError.message}`);
          console.error('Delete error:', deleteError);
        } else {
          totalDeleted += batch.length;
          console.log(`✅ Deleted batch of ${batch.length} questions`);
        }
      }

      console.log(`🎯 CLEANUP COMPLETE: Deleted ${totalDeleted} placeholder questions`);
      return { deleted: totalDeleted, errors };

    } catch (error) {
      console.error('Failed to delete placeholder questions:', error);
      return { deleted: 0, errors: [error.message] };
    }
  }

  /**
   * Get statistics on question quality
   */
  static async getValidationStats(): Promise<{
    total: number;
    valid: number;
    invalid: number;
    critical: number;
    placeholderCount: number;
  }> {
    try {
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*');

      if (error) throw error;

      if (!questions?.length) {
        return { total: 0, valid: 0, invalid: 0, critical: 0, placeholderCount: 0 };
      }

      let valid = 0;
      let invalid = 0;
      let critical = 0;
      let placeholderCount = 0;

      for (const question of questions) {
        // Ensure difficulty is properly typed before validation
        const questionToValidate = {
          ...question,
          difficulty: question.difficulty as 'easy' | 'medium' | 'hard'
        };
        
        const validation = await QuestionValidationService.preValidateQuestion(questionToValidate);
        
        if (validation.isValid) {
          valid++;
        } else {
          invalid++;
          if (validation.severity === 'critical') {
            critical++;
          }
          
          // Check for placeholder patterns
          if (this.hasPlaceholderPatterns(question)) {
            placeholderCount++;
          }
        }
      }

      return {
        total: questions.length,
        valid,
        invalid,
        critical,
        placeholderCount
      };

    } catch (error) {
      console.error('Failed to get validation stats:', error);
      return { total: 0, valid: 0, invalid: 0, critical: 0, placeholderCount: 0 };
    }
  }

  /**
   * Check for placeholder patterns in question content
   */
  private static hasPlaceholderPatterns(question: any): boolean {
    const placeholderPatterns = [
      /methodology [a-d]/i,
      /approach [a-d]/i,
      /technique [a-d]/i,
      /method [a-d]/i,
      /with specialized parameters/i,
      /with novel framework/i,
      /advanced methodology/i,
      /cutting-edge approach/i,
      /innovative technique/i,
      /state-of-the-art method/i
    ];

    const textToCheck = [
      question.text,
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d
    ].filter(Boolean).join(' ');

    return placeholderPatterns.some(pattern => pattern.test(textToCheck));
  }
}
