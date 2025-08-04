/**
 * Centralized API service layer for Quiz Game
 * Handles all backend operations with proper error handling and validation
 */

import { supabase } from "@/integrations/supabase/client";
import { Question, QuestionType, DifficultyLevel, QuestionCategory } from "@/types/quiz";
import { CommunityValidationService } from "@/services/quality/communityValidation";
import { EnhancedQuestionDeduplication } from "@/services/quality/enhancedDeduplication";
import { isValidQuestion } from "@/services/template/questionValidation";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    returned?: number;
    hasMore?: boolean;
  };
}

export interface QuestionRequest {
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  countryId: string;
  explanation?: string;
}

export interface QuestionFilters {
  countryId?: string;
  difficulty?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export class ApiService {
  
  /**
   * Get questions with proper validation and deduplication
   */
  static async getQuestions(filters: QuestionFilters): Promise<ApiResponse<Question[]>> {
    try {
      console.log('🔍 API: Fetching questions with filters:', filters);
      
      let query = supabase
        .from('questions')
        .select('*')
        .limit(filters.limit || 20);

      if (filters.countryId) {
        query = query.eq('country_id', filters.countryId);
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data: questions, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch questions',
            details: error
          }
        };
      }

      if (!questions || questions.length === 0) {
        return {
          success: true,
          data: [],
          meta: { total: 0, returned: 0, hasMore: false }
        };
      }

      // Transform to frontend format
      const transformedQuestions: Question[] = questions.map(q => ({
        id: q.id,
        type: 'multiple-choice' as QuestionType,
        text: q.text,
        choices: [
          { id: 'a', text: q.option_a, isCorrect: q.correct_answer === q.option_a },
          { id: 'b', text: q.option_b, isCorrect: q.correct_answer === q.option_b },
          { id: 'c', text: q.option_c, isCorrect: q.correct_answer === q.option_c },
          { id: 'd', text: q.option_d, isCorrect: q.correct_answer === q.option_d }
        ],
        difficulty: q.difficulty as DifficultyLevel,
        category: q.category as QuestionCategory,
        explanation: q.explanation || '',
        imageUrl: q.image_url
      }));

      // Validate questions before returning
      const validQuestions = transformedQuestions.filter(q => {
        const questionData = {
          text: q.text,
          options: q.choices.map(c => c.text),
          correct: q.choices.find(c => c.isCorrect)?.text || ''
        };
        return isValidQuestion(questionData);
      });

      console.log(`✅ API: Returning ${validQuestions.length} valid questions out of ${questions.length} total`);

      return {
        success: true,
        data: validQuestions,
        meta: {
          total: count || questions.length,
          returned: validQuestions.length,
          hasMore: (filters.offset || 0) + validQuestions.length < (count || questions.length)
        }
      };

    } catch (error) {
      console.error('❌ API: Error fetching questions:', error);
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Internal server error',
          details: error
        }
      };
    }
  }

  /**
   * Validate a question before creation/update
   */
  static async validateQuestion(question: QuestionRequest): Promise<ApiResponse<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }>> {
    try {
      const issues: string[] = [];
      const suggestions: string[] = [];

      // Basic validation
      const questionData = {
        text: question.text,
        options: question.options,
        correct: question.correctAnswer
      };

      if (!isValidQuestion(questionData)) {
        if (question.text.length < 20) {
          issues.push('Question text must be at least 20 characters long');
          suggestions.push('Add more context or detail to the question');
        }

        if (!question.options.includes(question.correctAnswer)) {
          issues.push('Correct answer must match one of the provided options');
          suggestions.push('Check that the correct answer exactly matches one option');
        }

        if (new Set(question.options).size !== 4) {
          issues.push('All four options must be unique');
          suggestions.push('Ensure each answer option is different from the others');
        }
      }

      // Check for placeholder text
      const allText = [question.text, ...question.options].join(' ').toLowerCase();
      const placeholderPatterns = [
        'correct answer for', 'option a for', 'option b for', 'option c for', 'option d for',
        'placeholder', 'methodology', 'approach', 'technique', 'method'
      ];

      for (const pattern of placeholderPatterns) {
        if (allText.includes(pattern)) {
          issues.push(`Contains placeholder text: "${pattern}"`);
          suggestions.push('Replace placeholder text with actual content');
        }
      }

      // Check country validity
      if (question.countryId) {
        const { data: country } = await supabase
          .from('countries')
          .select('id')
          .eq('id', question.countryId)
          .maybeSingle();

        if (!country) {
          issues.push('Invalid country ID');
          suggestions.push('Use a valid country identifier');
        }
      }

      return {
        success: true,
        data: {
          isValid: issues.length === 0,
          issues,
          suggestions
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Failed to validate question',
          details: error
        }
      };
    }
  }

  /**
   * Create a new question (admin only)
   */
  static async createQuestion(question: QuestionRequest): Promise<ApiResponse<{ id: string }>> {
    try {
      // Validate first
      const validation = await this.validateQuestion(question);
      if (!validation.success || !validation.data?.isValid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Question validation failed',
            details: validation.data?.issues
          }
        };
      }

      // Check for duplicates
      const fingerprint = this.createQuestionFingerprint(question);
      const { data: existing } = await supabase
        .from('questions')
        .select('id')
        .eq('country_id', question.countryId)
        .limit(1000); // Get sample to check fingerprints

      if (existing) {
        for (const existingQ of existing) {
          const { data: fullQuestion } = await supabase
            .from('questions')
            .select('*')
            .eq('id', existingQ.id)
            .single();

          if (fullQuestion && this.createQuestionFingerprint(fullQuestion) === fingerprint) {
            return {
              success: false,
              error: {
                code: 'DUPLICATE_QUESTION',
                message: 'A similar question already exists',
                details: { existingId: fullQuestion.id }
              }
            };
          }
        }
      }

      // Create the question
      const questionId = `${question.countryId}_${question.difficulty}_${Date.now()}`;
      
      const { error } = await supabase
        .from('questions')
        .insert({
          id: questionId,
          text: question.text,
          option_a: question.options[0],
          option_b: question.options[1],
          option_c: question.options[2],
          option_d: question.options[3],
          correct_answer: question.correctAnswer,
          difficulty: question.difficulty,
          category: question.category,
          country_id: question.countryId,
          explanation: question.explanation
        });

      if (error) {
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to create question',
            details: error
          }
        };
      }

      return {
        success: true,
        data: { id: questionId }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create question',
          details: error
        }
      };
    }
  }

  /**
   * Get quality statistics for a country or globally
   */
  static async getQualityStats(countryId?: string): Promise<ApiResponse<{
    totalQuestions: number;
    validQuestions: number;
    duplicates: number;
    qualityScore: number;
    recentReports: number;
  }>> {
    try {
      let query = supabase.from('questions').select('*');
      if (countryId) {
        query = query.eq('country_id', countryId);
      }

      const { data: questions, error } = await query;
      if (error) throw error;

      if (!questions) {
        return {
          success: true,
          data: {
            totalQuestions: 0,
            validQuestions: 0,
            duplicates: 0,
            qualityScore: 0,
            recentReports: 0
          }
        };
      }

      // Validate questions
      let validQuestions = 0;
      const fingerprints = new Set<string>();
      let duplicates = 0;

      for (const question of questions) {
        const questionData = {
          text: question.text,
          options: [question.option_a, question.option_b, question.option_c, question.option_d],
          correct: question.correct_answer
        };

        if (isValidQuestion(questionData)) {
          validQuestions++;
        }

        const fingerprint = this.createQuestionFingerprint(question);
        if (fingerprints.has(fingerprint)) {
          duplicates++;
        } else {
          fingerprints.add(fingerprint);
        }
      }

      // Get recent reports
      const { data: reports } = await supabase
        .from('question_votes')
        .select('id')
        .eq('vote_type', 'report')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

      const qualityScore = Math.round((validQuestions / Math.max(questions.length, 1)) * 100);

      return {
        success: true,
        data: {
          totalQuestions: questions.length,
          validQuestions,
          duplicates,
          qualityScore,
          recentReports: reports?.length || 0
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to get quality stats',
          details: error
        }
      };
    }
  }

  /**
   * Run comprehensive cleanup for a country
   */
  static async runCleanup(countryId: string): Promise<ApiResponse<{
    deduplicationResults: any;
    validationResults: any;
    finalStats: any;
  }>> {
    try {
      console.log(`🚀 API: Starting cleanup for ${countryId}...`);

      const results = await EnhancedQuestionDeduplication.runComprehensiveCleanup(countryId);

      return {
        success: true,
        data: {
          deduplicationResults: results.deduplication,
          validationResults: results.validation,
          finalStats: results.finalStats
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Cleanup failed',
          details: error
        }
      };
    }
  }

  /**
   * Create question fingerprint for duplicate detection
   */
  private static createQuestionFingerprint(question: any): string {
    const normalizedText = question.text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const options = question.options || [
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d
    ];

    const normalizedOptions = options
      .map((opt: string) => opt?.toLowerCase().replace(/[^\w\s]/g, '').trim())
      .sort()
      .join('|');

    return `${normalizedText}::${normalizedOptions}`;
  }

  // Re-export community validation methods
  static voteOnQuestion = CommunityValidationService.voteOnQuestion;
  static reportQuestion = CommunityValidationService.reportQuestion;
  static getPendingModerationQuestions = CommunityValidationService.getPendingModerationQuestions;
  static moderateQuestion = CommunityValidationService.moderateQuestion;
  static getQuestionQualityMetrics = CommunityValidationService.getQuestionQualityMetrics;
  static getUserModerationStats = CommunityValidationService.getUserModerationStats;
  static getTopContributors = CommunityValidationService.getTopContributors;
}