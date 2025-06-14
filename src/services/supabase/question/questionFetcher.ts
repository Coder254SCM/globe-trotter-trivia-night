
import { supabase } from "@/integrations/supabase/client";
import { Question as FrontendQuestion } from "@/types/quiz";
import { Question, QuestionFilter } from "./questionTypes";

export class QuestionFetcher {
  /**
   * Get questions for a specific country with filtering and validation
   */
  static async getQuestions(
    countryId: string, 
    difficulty?: string, 
    limit: number = 10
  ): Promise<FrontendQuestion[]> {
    try {
      console.log(`🔍 Fetching questions for country: ${countryId}, difficulty: ${difficulty}, limit: ${limit}`);
      
      let query = supabase
        .from('questions')
        .select('*')
        .eq('country_id', countryId);

      // Apply difficulty filter if specified
      if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
        query = query.eq('difficulty', difficulty);
        console.log(`🎯 Filtering by difficulty: ${difficulty}`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching questions:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} questions`);
      
      if (!data || data.length === 0) {
        console.warn(`⚠️ No questions found for country ${countryId} with difficulty ${difficulty}`);
        // Try without difficulty filter as fallback
        if (difficulty) {
          console.log('🔄 Retrying without difficulty filter...');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('questions')
            .select('*')
            .eq('country_id', countryId)
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (fallbackError) throw fallbackError;
          return (fallbackData || []).map(q => this.transformToFrontendQuestion(q)).filter(q => this.validateQuestion(q));
        }
        return [];
      }

      // Transform and validate all questions
      const transformedQuestions = data.map(q => this.transformToFrontendQuestion(q)).filter(q => this.validateQuestion(q));
      console.log(`✅ Successfully transformed and validated ${transformedQuestions.length} questions`);
      
      return transformedQuestions;
    } catch (error) {
      console.error('💥 Failed to fetch questions:', error);
      throw error;
    }
  }

  /**
   * Get questions by multiple filters
   */
  static async getFilteredQuestions(filters: QuestionFilter): Promise<FrontendQuestion[]> {
    try {
      console.log('🔍 Fetching filtered questions:', filters);
      
      let query = supabase.from('questions').select('*');

      if (filters.countryId) {
        query = query.eq('country_id', filters.countryId);
      }

      if (filters.difficulty && ['easy', 'medium', 'hard'].includes(filters.difficulty)) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(filters.limit || 50);

      if (error) throw error;

      console.log(`✅ Found ${data?.length || 0} filtered questions`);
      const validQuestions = (data || []).map(q => this.transformToFrontendQuestion(q)).filter(q => this.validateQuestion(q));
      console.log(`✅ ${validQuestions.length} questions passed validation`);
      
      return validQuestions;
    } catch (error) {
      console.error('💥 Failed to fetch filtered questions:', error);
      throw error;
    }
  }

  /**
   * Validate question has proper content and structure
   */
  static validateQuestion(question: FrontendQuestion): boolean {
    // Check for placeholder text in question
    if (question.text.includes('[country]') || 
        question.text.includes('[capital]') || 
        question.text.toLowerCase().includes('placeholder') ||
        question.text.toLowerCase().includes('option a for') ||
        question.text.toLowerCase().includes('correct answer for')) {
      console.warn('❌ Question contains placeholder text:', question.text.substring(0, 50));
      return false;
    }

    // Check for placeholder text in choices
    for (const choice of question.choices) {
      if (choice.text.toLowerCase().includes('placeholder') ||
          choice.text.toLowerCase().includes('option a for') ||
          choice.text.toLowerCase().includes('incorrect option')) {
        console.warn('❌ Choice contains placeholder text:', choice.text);
        return false;
      }
    }

    // Check that we have exactly 4 choices
    if (question.choices.length !== 4) {
      console.warn('❌ Question does not have exactly 4 choices:', question.choices.length);
      return false;
    }

    // Check that exactly one choice is correct
    const correctChoices = question.choices.filter(c => c.isCorrect);
    if (correctChoices.length !== 1) {
      console.warn('❌ Question does not have exactly 1 correct choice:', correctChoices.length);
      return false;
    }

    // Check for duplicate choices
    const choiceTexts = question.choices.map(c => c.text.toLowerCase());
    const uniqueChoices = new Set(choiceTexts);
    if (uniqueChoices.size !== 4) {
      console.warn('❌ Question has duplicate choices');
      return false;
    }

    return true;
  }

  /**
   * Transform Supabase question to frontend format with proper validation
   */
  static transformToFrontendQuestion(supabaseQuestion: any): FrontendQuestion {
    // Ensure all required fields exist
    if (!supabaseQuestion.text || !supabaseQuestion.correct_answer) {
      console.warn('⚠️ Invalid question data:', supabaseQuestion);
    }

    // Clean and validate options
    const options = [
      supabaseQuestion.option_a,
      supabaseQuestion.option_b, 
      supabaseQuestion.option_c,
      supabaseQuestion.option_d
    ].filter(Boolean); // Remove any null/undefined options

    if (options.length < 4) {
      console.warn('⚠️ Question has missing options:', supabaseQuestion.id);
    }

    // Create choices with proper validation
    const choices = [
      { 
        id: 'a', 
        text: supabaseQuestion.option_a || 'Option A missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_a 
      },
      { 
        id: 'b', 
        text: supabaseQuestion.option_b || 'Option B missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_b 
      },
      { 
        id: 'c', 
        text: supabaseQuestion.option_c || 'Option C missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_c 
      },
      { 
        id: 'd', 
        text: supabaseQuestion.option_d || 'Option D missing', 
        isCorrect: supabaseQuestion.correct_answer === supabaseQuestion.option_d 
      }
    ];

    // Log the transformation for debugging
    console.log('🔄 Transforming question:', {
      id: supabaseQuestion.id,
      text: supabaseQuestion.text?.substring(0, 50) + '...',
      correctAnswer: supabaseQuestion.correct_answer,
      choices: choices.map(c => ({ id: c.id, text: c.text.substring(0, 20) + '...', isCorrect: c.isCorrect }))
    });

    return {
      id: supabaseQuestion.id,
      type: 'multiple-choice',
      text: supabaseQuestion.text || 'Question text missing',
      imageUrl: supabaseQuestion.image_url,
      choices,
      category: supabaseQuestion.category || 'General',
      explanation: supabaseQuestion.explanation || 'No explanation available',
      difficulty: (supabaseQuestion.difficulty as 'easy' | 'medium' | 'hard') || 'medium'
    };
  }
}
