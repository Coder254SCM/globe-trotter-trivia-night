
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";
import { QuestionTransformer } from "./questionTransformer";
import { QuestionValidator } from "./questionValidator";

export interface QuestionFilter {
  countryId?: string;
  difficulty?: string;
  category?: string;
  limit?: number;
  excludeEasy?: boolean;
  validateContent?: boolean;
}

export class EnhancedQuestionFetcher {
  /**
   * Get filtered questions with enhanced validation and better logging
   */
  static async getFilteredQuestions(filter: QuestionFilter): Promise<FrontendQuestion[]> {
    console.log('🔍 [EnhancedQuestionFetcher] Fetching filtered questions:', filter);
    
    try {
      let query = supabase
        .from('questions')
        .select(`
          id,
          text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          explanation,
          category,
          difficulty,
          image_url,
          countries (name)
        `);

      // Apply filters
      if (filter.countryId) {
        query = query.eq('country_id', filter.countryId);
      }

      if (filter.difficulty) {
        query = query.eq('difficulty', filter.difficulty);
      }

      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      // Always exclude easy questions if requested
      if (filter.excludeEasy) {
        query = query.neq('difficulty', 'easy');
      }

      // Limit results
      if (filter.limit) {
        query = query.limit(filter.limit * 3); // Get more to allow for deduplication
      }

      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false });

      console.log('🔍 [EnhancedQuestionFetcher] Executing query...');
      const { data, error } = await query;

      if (error) {
        console.error('❌ [EnhancedQuestionFetcher] Database error:', error);
        throw error;
      }

      console.log(`📋 [EnhancedQuestionFetcher] Raw data returned: ${data?.length || 0} questions`);

      if (!data?.length) {
        console.warn('⚠️ [EnhancedQuestionFetcher] No questions found with filters:', filter);
        return [];
      }

      // Transform to frontend format
      let transformedQuestions = data.map(q => QuestionTransformer.transformToFrontendQuestion(q));
      console.log(`🔄 [EnhancedQuestionFetcher] Transformed ${transformedQuestions.length} questions`);

      // Apply content validation if requested
      if (filter.validateContent) {
        const beforeValidation = transformedQuestions.length;
        transformedQuestions = QuestionValidator.validateQuestionContent(transformedQuestions);
        console.log(`✅ [EnhancedQuestionFetcher] After validation: ${transformedQuestions.length}/${beforeValidation} questions passed`);
      }

      // Deduplicate questions
      transformedQuestions = QuestionValidator.deduplicateQuestions(transformedQuestions);
      console.log(`🔄 [EnhancedQuestionFetcher] After deduplication: ${transformedQuestions.length} unique questions`);

      // Limit to requested amount
      if (filter.limit && transformedQuestions.length > filter.limit) {
        transformedQuestions = transformedQuestions.slice(0, filter.limit);
      }

      console.log(`✅ [EnhancedQuestionFetcher] Returning ${transformedQuestions.length} final questions`);
      return transformedQuestions;

    } catch (error) {
      console.error('❌ [EnhancedQuestionFetcher] Failed to fetch filtered questions:', error);
      return [];
    }
  }

  /**
   * Get questions with legacy fallback support
   */
  static async getQuestions(
    countryId?: string,
    difficulty?: string,
    limit: number = 10
  ): Promise<FrontendQuestion[]> {
    console.log(`🔍 [EnhancedQuestionFetcher] Legacy getQuestions called: countryId=${countryId}, difficulty=${difficulty}, limit=${limit}`);
    
    return this.getFilteredQuestions({
      countryId,
      difficulty,
      limit,
      validateContent: false  // Less strict for legacy calls
    });
  }
}
