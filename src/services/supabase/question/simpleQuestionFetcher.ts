
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";

export interface QuestionFilter {
  countryId?: string;
  difficulty?: string;
  category?: string;
  limit?: number;
  validateContent?: boolean;
}

export class SimpleQuestionFetcher {
  /**
   * Get questions with simple filtering
   */
  static async getFilteredQuestions(filter: QuestionFilter): Promise<FrontendQuestion[]> {
    console.log('🔍 [SimpleQuestionFetcher] Fetching questions:', filter);
    
    try {
      let query = supabase
        .from('questions')
        .select('*');

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

      // Limit results
      if (filter.limit) {
        query = query.limit(filter.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [SimpleQuestionFetcher] Database error:', error);
        throw error;
      }

      console.log(`📋 [SimpleQuestionFetcher] Found ${data?.length || 0} questions`);

      if (!data?.length) {
        return [];
      }

      // Transform to frontend format
      const transformedQuestions = data.map(q => this.transformToFrontendQuestion(q));
      console.log(`✅ [SimpleQuestionFetcher] Returning ${transformedQuestions.length} questions`);
      
      return transformedQuestions;

    } catch (error) {
      console.error('❌ [SimpleQuestionFetcher] Failed to fetch questions:', error);
      return [];
    }
  }

  /**
   * Transform database question to frontend format
   */
  static transformToFrontendQuestion(dbQuestion: any): FrontendQuestion {
    const choices = [
      { id: 'a', text: dbQuestion.option_a, isCorrect: dbQuestion.correct_answer === dbQuestion.option_a },
      { id: 'b', text: dbQuestion.option_b, isCorrect: dbQuestion.correct_answer === dbQuestion.option_b },
      { id: 'c', text: dbQuestion.option_c, isCorrect: dbQuestion.correct_answer === dbQuestion.option_c },
      { id: 'd', text: dbQuestion.option_d, isCorrect: dbQuestion.correct_answer === dbQuestion.option_d },
    ];

    return {
      id: dbQuestion.id,
      type: 'multiple-choice',
      text: dbQuestion.text,
      choices,
      explanation: dbQuestion.explanation || `The correct answer is ${dbQuestion.correct_answer}.`,
      category: dbQuestion.category,
      difficulty: dbQuestion.difficulty,
      imageUrl: dbQuestion.image_url
    };
  }
}
