
import { supabase } from "@/integrations/supabase/client";
import { QuestionValidationService } from "./questionValidationService";

export interface CleanupResult {
  deletedQuestions: number;
  fixedQuestions: number;
  errors: string[];
  summary: string;
}

export class QuestionCleanupService {
  /**
   * Comprehensive cleanup of all question problems
   */
  static async performComprehensiveCleanup(): Promise<CleanupResult> {
    console.log('🧹 Starting comprehensive question cleanup...');
    
    const result: CleanupResult = {
      deletedQuestions: 0,
      fixedQuestions: 0,
      errors: [],
      summary: ''
    };

    try {
      // Step 1: Delete all remaining easy questions
      await this.deleteEasyQuestions(result);
      
      // Step 2: Delete placeholder questions
      await this.deletePlaceholderQuestions(result);
      
      // Step 3: Delete duplicate questions
      await this.deleteDuplicateQuestions(result);
      
      // Step 4: Fix broken image URLs
      await this.fixBrokenImages(result);
      
      // Step 5: Validate and fix remaining questions
      await this.validateAndFixQuestions(result);
      
      result.summary = `Cleanup complete: ${result.deletedQuestions} deleted, ${result.fixedQuestions} fixed`;
      console.log('✅ Cleanup completed:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      result.errors.push(`Cleanup failed: ${error.message}`);
      return result;
    }
  }

  /**
   * Delete all easy questions completely
   */
  private static async deleteEasyQuestions(result: CleanupResult): Promise<void> {
    console.log('🗑️ Deleting all easy questions...');
    
    const { data: easyQuestions, error: fetchError } = await supabase
      .from('questions')
      .select('id')
      .eq('difficulty', 'easy');

    if (fetchError) {
      result.errors.push(`Failed to fetch easy questions: ${fetchError.message}`);
      return;
    }

    if (!easyQuestions?.length) {
      console.log('✅ No easy questions found to delete');
      return;
    }

    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('difficulty', 'easy');

    if (deleteError) {
      result.errors.push(`Failed to delete easy questions: ${deleteError.message}`);
    } else {
      result.deletedQuestions += easyQuestions.length;
      console.log(`✅ Deleted ${easyQuestions.length} easy questions`);
    }
  }

  /**
   * Delete questions with placeholder content
   */
  private static async deletePlaceholderQuestions(result: CleanupResult): Promise<void> {
    console.log('🗑️ Deleting placeholder questions...');
    
    const placeholderPatterns = [
      '%placeholder%',
      '%methodology%',
      '%approach%',
      '%technique%',
      '%method%',
      '%Option % for%',
      '%correct answer for%',
      '%incorrect option%',
      '%cutting-edge%',
      '%state-of-the-art%',
      '%innovative%',
      '%advanced%'
    ];

    for (const pattern of placeholderPatterns) {
      const { data: questions, error: fetchError } = await supabase
        .from('questions')
        .select('id')
        .or(`text.ilike.${pattern},option_a.ilike.${pattern},option_b.ilike.${pattern},option_c.ilike.${pattern},option_d.ilike.${pattern}`);

      if (fetchError) {
        result.errors.push(`Failed to fetch placeholder questions: ${fetchError.message}`);
        continue;
      }

      if (questions?.length) {
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .in('id', questions.map(q => q.id));

        if (deleteError) {
          result.errors.push(`Failed to delete placeholder questions: ${deleteError.message}`);
        } else {
          result.deletedQuestions += questions.length;
          console.log(`✅ Deleted ${questions.length} questions with pattern: ${pattern}`);
        }
      }
    }
  }

  /**
   * Delete duplicate questions (keep first occurrence)
   */
  private static async deleteDuplicateQuestions(result: CleanupResult): Promise<void> {
    console.log('🗑️ Finding and deleting duplicate questions...');
    
    // Find duplicates by question text
    const { data: allQuestions, error: fetchError } = await supabase
      .from('questions')
      .select('id, text, created_at')
      .order('created_at', { ascending: true });

    if (fetchError) {
      result.errors.push(`Failed to fetch questions for duplicate check: ${fetchError.message}`);
      return;
    }

    if (!allQuestions?.length) return;

    const seen = new Set<string>();
    const duplicateIds: string[] = [];

    allQuestions.forEach(question => {
      const normalizedText = question.text.toLowerCase().trim();
      
      if (seen.has(normalizedText)) {
        duplicateIds.push(question.id);
      } else {
        seen.add(normalizedText);
      }
    });

    if (duplicateIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .in('id', duplicateIds);

      if (deleteError) {
        result.errors.push(`Failed to delete duplicate questions: ${deleteError.message}`);
      } else {
        result.deletedQuestions += duplicateIds.length;
        console.log(`✅ Deleted ${duplicateIds.length} duplicate questions`);
      }
    }
  }

  /**
   * Fix broken image URLs by setting them to null
   */
  private static async fixBrokenImages(result: CleanupResult): Promise<void> {
    console.log('🖼️ Fixing broken image URLs...');
    
    const { data: questionsWithImages, error: fetchError } = await supabase
      .from('questions')
      .select('id, image_url')
      .not('image_url', 'is', null);

    if (fetchError) {
      result.errors.push(`Failed to fetch questions with images: ${fetchError.message}`);
      return;
    }

    if (!questionsWithImages?.length) return;

    const brokenImageIds: string[] = [];

    // Check each image URL
    for (const question of questionsWithImages) {
      try {
        const response = await fetch(question.image_url, { method: 'HEAD', timeout: 5000 });
        if (!response.ok) {
          brokenImageIds.push(question.id);
        }
      } catch {
        brokenImageIds.push(question.id);
      }
    }

    if (brokenImageIds.length > 0) {
      const { error: updateError } = await supabase
        .from('questions')
        .update({ image_url: null })
        .in('id', brokenImageIds);

      if (updateError) {
        result.errors.push(`Failed to fix broken images: ${updateError.message}`);
      } else {
        result.fixedQuestions += brokenImageIds.length;
        console.log(`✅ Fixed ${brokenImageIds.length} broken image URLs`);
      }
    }
  }

  /**
   * Validate and fix remaining questions
   */
  private static async validateAndFixQuestions(result: CleanupResult): Promise<void> {
    console.log('✅ Validating remaining questions...');
    
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .limit(1000); // Process in batches

    if (fetchError) {
      result.errors.push(`Failed to fetch questions for validation: ${fetchError.message}`);
      return;
    }

    if (!questions?.length) return;

    const invalidIds: string[] = [];

    for (const question of questions) {
      const validation = await QuestionValidationService.preValidateQuestion({
        text: question.text,
        option_a: question.option_a || '',
        option_b: question.option_b || '',
        option_c: question.option_c || '',
        option_d: question.option_d || '',
        correct_answer: question.correct_answer,
        difficulty: question.difficulty as 'easy' | 'medium' | 'hard',
        country_id: question.country_id,
        category: question.category
      });

      if (!validation.isValid && validation.severity === 'critical') {
        invalidIds.push(question.id);
      }
    }

    if (invalidIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .in('id', invalidIds);

      if (deleteError) {
        result.errors.push(`Failed to delete invalid questions: ${deleteError.message}`);
      } else {
        result.deletedQuestions += invalidIds.length;
        console.log(`✅ Deleted ${invalidIds.length} invalid questions`);
      }
    }
  }

  /**
   * Get cleanup statistics
   */
  static async getCleanupStats(): Promise<{
    totalQuestions: number;
    questionsByDifficulty: Record<string, number>;
    questionsWithImages: number;
    estimatedIssues: number;
  }> {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('difficulty, image_url');

    if (error) {
      console.error('Failed to get cleanup stats:', error);
      return {
        totalQuestions: 0,
        questionsByDifficulty: {},
        questionsWithImages: 0,
        estimatedIssues: 0
      };
    }

    const stats = {
      totalQuestions: questions?.length || 0,
      questionsByDifficulty: {} as Record<string, number>,
      questionsWithImages: 0,
      estimatedIssues: 0
    };

    questions?.forEach(q => {
      // Count by difficulty
      const difficulty = q.difficulty || 'unknown';
      stats.questionsByDifficulty[difficulty] = (stats.questionsByDifficulty[difficulty] || 0) + 1;
      
      // Count images
      if (q.image_url) {
        stats.questionsWithImages++;
      }
    });

    return stats;
  }
}
