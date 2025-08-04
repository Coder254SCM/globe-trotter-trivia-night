/**
 * Enhanced question deduplication service
 * Fixes the critical issue of only 12 questions loading instead of requested count
 */

import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/quiz";
import { isValidQuestion } from "@/services/template/questionValidation";

export class EnhancedQuestionDeduplication {
  
  /**
   * Remove duplicate questions from database for a specific country
   */
  static async deduplicateCountryQuestions(countryId: string): Promise<{
    removedCount: number;
    keepCount: number;
  }> {
    try {
      console.log(`🔍 Starting deduplication for ${countryId}...`);
      
      // Get all questions for the country
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('country_id', countryId)
        .order('created_at', { ascending: true }); // Keep older questions

      if (error) throw error;
      if (!questions || questions.length === 0) return { removedCount: 0, keepCount: 0 };

      console.log(`📊 Found ${questions.length} questions for ${countryId}`);

      // Group questions by fingerprint
      const questionGroups = new Map<string, any[]>();
      
      for (const question of questions) {
        const fingerprint = this.createQuestionFingerprint(question);
        if (!questionGroups.has(fingerprint)) {
          questionGroups.set(fingerprint, []);
        }
        questionGroups.get(fingerprint)!.push(question);
      }

      console.log(`📊 Found ${questionGroups.size} unique question fingerprints`);

      // Find duplicates and mark for removal
      const questionsToRemove: string[] = [];
      let duplicateGroups = 0;

      for (const [fingerprint, groupQuestions] of questionGroups) {
        if (groupQuestions.length > 1) {
          duplicateGroups++;
          console.log(`🔍 Found ${groupQuestions.length} duplicates for fingerprint: ${fingerprint.substring(0, 50)}...`);
          
          // Keep the first (oldest) question, remove the rest
          const [keep, ...remove] = groupQuestions;
          questionsToRemove.push(...remove.map(q => q.id));
          
          console.log(`  ✅ Keeping: ${keep.id}`);
          console.log(`  ❌ Removing: ${remove.map(q => q.id).join(', ')}`);
        }
      }

      // Remove duplicates in batches
      if (questionsToRemove.length > 0) {
        console.log(`🗑️ Removing ${questionsToRemove.length} duplicate questions...`);
        
        // Remove in batches of 100 to avoid database limits
        for (let i = 0; i < questionsToRemove.length; i += 100) {
          const batch = questionsToRemove.slice(i, i + 100);
          const { error: deleteError } = await supabase
            .from('questions')
            .delete()
            .in('id', batch);

          if (deleteError) {
            console.error(`❌ Error removing batch ${i}-${i + batch.length}:`, deleteError);
          } else {
            console.log(`✅ Removed batch ${i}-${i + batch.length}`);
          }
        }
      }

      const keepCount = questions.length - questionsToRemove.length;
      console.log(`✅ Deduplication complete for ${countryId}: removed ${questionsToRemove.length}, kept ${keepCount}`);

      return {
        removedCount: questionsToRemove.length,
        keepCount
      };
    } catch (error) {
      console.error(`❌ Failed to deduplicate questions for ${countryId}:`, error);
      return { removedCount: 0, keepCount: 0 };
    }
  }

  /**
   * Remove all questions with validation errors
   */
  static async removeInvalidQuestions(countryId?: string): Promise<{
    removedCount: number;
    issues: string[];
  }> {
    try {
      console.log(`🔍 Finding invalid questions${countryId ? ` for ${countryId}` : ' globally'}...`);
      
      let query = supabase.from('questions').select('*');
      if (countryId) {
        query = query.eq('country_id', countryId);
      }

      const { data: questions, error } = await query;
      if (error) throw error;
      if (!questions) return { removedCount: 0, issues: [] };

      console.log(`📊 Checking ${questions.length} questions for validity...`);

      const invalidQuestions: string[] = [];
      const issues: string[] = [];

      for (const question of questions) {
        const questionData = {
          text: question.text,
          options: [question.option_a, question.option_b, question.option_c, question.option_d],
          correct: question.correct_answer
        };

        if (!isValidQuestion(questionData)) {
          invalidQuestions.push(question.id);
          
          // Identify specific issues
          if (questionData.text.length < 20) {
            issues.push(`Question too short: ${question.id}`);
          }
          if (!questionData.options.includes(questionData.correct)) {
            issues.push(`Correct answer mismatch: ${question.id}`);
          }
          if (new Set(questionData.options).size !== 4) {
            issues.push(`Duplicate options: ${question.id}`);
          }
        }
      }

      // Remove invalid questions
      if (invalidQuestions.length > 0) {
        console.log(`🗑️ Removing ${invalidQuestions.length} invalid questions...`);
        
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .in('id', invalidQuestions);

        if (deleteError) {
          console.error('❌ Error removing invalid questions:', deleteError);
          return { removedCount: 0, issues };
        }
      }

      console.log(`✅ Removed ${invalidQuestions.length} invalid questions`);
      return {
        removedCount: invalidQuestions.length,
        issues: issues.slice(0, 20) // Limit to first 20 issues
      };
    } catch (error) {
      console.error('❌ Failed to remove invalid questions:', error);
      return { removedCount: 0, issues: [`Error: ${error}`] };
    }
  }

  /**
   * Get question count statistics for a country
   */
  static async getQuestionStats(countryId: string): Promise<{
    total: number;
    easy: number;
    medium: number;
    hard: number;
    duplicateFingerprints: number;
  }> {
    try {
      const { data: questions, error } = await supabase
        .from('questions')
        .select('id, difficulty, text, option_a, option_b, option_c, option_d, correct_answer')
        .eq('country_id', countryId);

      if (error) throw error;
      if (!questions) return { total: 0, easy: 0, medium: 0, hard: 0, duplicateFingerprints: 0 };

      const stats = {
        total: questions.length,
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length,
        duplicateFingerprints: 0
      };

      // Check for duplicates
      const fingerprints = new Set<string>();
      let duplicates = 0;

      for (const question of questions) {
        const fingerprint = this.createQuestionFingerprint(question);
        if (fingerprints.has(fingerprint)) {
          duplicates++;
        } else {
          fingerprints.add(fingerprint);
        }
      }

      stats.duplicateFingerprints = duplicates;

      return stats;
    } catch (error) {
      console.error(`❌ Failed to get question stats for ${countryId}:`, error);
      return { total: 0, easy: 0, medium: 0, hard: 0, duplicateFingerprints: 0 };
    }
  }

  /**
   * Create a unique fingerprint for a question
   */
  private static createQuestionFingerprint(question: any): string {
    const normalizedText = question.text
      .toLowerCase()
      .replace(/[^\\w\\s]/g, '')
      .replace(/\\s+/g, ' ')
      .trim();

    const normalizedOptions = [
      question.option_a,
      question.option_b, 
      question.option_c,
      question.option_d
    ]
      .map(opt => opt?.toLowerCase().replace(/[^\\w\\s]/g, '').trim())
      .sort()
      .join('|');

    return `${normalizedText}::${normalizedOptions}`;
  }

  /**
   * Run comprehensive cleanup for a country
   */
  static async runComprehensiveCleanup(countryId: string): Promise<{
    deduplication: { removedCount: number; keepCount: number };
    validation: { removedCount: number; issues: string[] };
    finalStats: any;
  }> {
    console.log(`🚀 Starting comprehensive cleanup for ${countryId}...`);

    // Step 1: Remove duplicates
    const deduplication = await this.deduplicateCountryQuestions(countryId);
    
    // Step 2: Remove invalid questions
    const validation = await this.removeInvalidQuestions(countryId);
    
    // Step 3: Get final stats
    const finalStats = await this.getQuestionStats(countryId);

    console.log(`✅ Comprehensive cleanup complete for ${countryId}`);
    console.log(`📊 Final stats:`, finalStats);

    return {
      deduplication,
      validation,
      finalStats
    };
  }
}
