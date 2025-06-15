
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";

export interface QuestionFilter {
  countryId?: string;
  difficulty?: string;
  category?: string;
  limit?: number;
  excludeEasy?: boolean;
  validateContent?: boolean;
}

export class QuestionFetcher {
  /**
   * Get filtered questions with enhanced validation and better logging
   */
  static async getFilteredQuestions(filter: QuestionFilter): Promise<FrontendQuestion[]> {
    console.log('🔍 [QuestionFetcher] Fetching filtered questions:', filter);
    
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
        query = query.limit(filter.limit);
      }

      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false });

      console.log('🔍 [QuestionFetcher] Executing query...');
      const { data, error } = await query;

      if (error) {
        console.error('❌ [QuestionFetcher] Database error:', error);
        throw error;
      }

      console.log(`📋 [QuestionFetcher] Raw data returned: ${data?.length || 0} questions`);

      if (!data?.length) {
        console.warn('⚠️ [QuestionFetcher] No questions found with filters:', filter);
        return [];
      }

      // Transform to frontend format
      let transformedQuestions = data.map(q => this.transformToFrontendQuestion(q));
      console.log(`🔄 [QuestionFetcher] Transformed ${transformedQuestions.length} questions`);

      // Apply content validation if requested
      if (filter.validateContent) {
        const beforeValidation = transformedQuestions.length;
        transformedQuestions = this.validateQuestionContent(transformedQuestions);
        console.log(`✅ [QuestionFetcher] After validation: ${transformedQuestions.length}/${beforeValidation} questions passed`);
      }

      console.log(`✅ [QuestionFetcher] Returning ${transformedQuestions.length} final questions`);
      return transformedQuestions;

    } catch (error) {
      console.error('❌ [QuestionFetcher] Failed to fetch filtered questions:', error);
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
    console.log(`🔍 [QuestionFetcher] Legacy getQuestions called: countryId=${countryId}, difficulty=${difficulty}, limit=${limit}`);
    
    return this.getFilteredQuestions({
      countryId,
      difficulty,
      limit,
      validateContent: false  // Less strict for legacy calls
    });
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

  /**
   * Validate question content for quality
   */
  private static validateQuestionContent(questions: FrontendQuestion[]): FrontendQuestion[] {
    const placeholderPatterns = [
      /placeholder/i,
      /methodology [a-d]/i,
      /approach [a-d]/i,
      /technique [a-d]/i,
      /method [a-d]/i,
      /option [a-d] for/i,
      /correct answer for/i,
      /incorrect option/i,
      /cutting-edge/i,
      /state-of-the-art/i,
      /innovative/i,
      /advanced/i
    ];

    return questions.filter(question => {
      const textToCheck = [
        question.text,
        ...question.choices.map(c => c.text)
      ].join(' ');

      const hasPlaceholders = placeholderPatterns.some(pattern => 
        pattern.test(textToCheck)
      );

      if (hasPlaceholders) {
        console.warn('❌ [QuestionFetcher] Filtered out question with placeholder content:', question.text.substring(0, 50));
        return false;
      }

      return true;
    });
  }
}
