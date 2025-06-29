
import { supabase } from "@/integrations/supabase/client";

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  questionText: string;
}

export interface QuestionToValidate {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  country_id?: string;
  category: string;
}

export class QuestionValidationService {
  /**
   * Pre-validate a question using client-side validation
   */
  static async preValidateQuestion(question: QuestionToValidate): Promise<ValidationResult> {
    try {
      return this.quickValidate(question);
    } catch (error) {
      console.error('Failed to validate question:', error);
      return {
        isValid: false,
        issues: ['Validation service error'],
        severity: 'critical',
        questionText: question.text ? question.text.substring(0, 60) + '...' : 'No text'
      };
    }
  }

  /**
   * Batch validate multiple questions
   */
  static async batchValidateQuestions(questions: QuestionToValidate[]): Promise<{
    totalQuestions: number;
    validQuestions: number;
    criticalIssues: number;
    results: Array<ValidationResult & { questionIndex: number }>;
  }> {
    const results = await Promise.all(
      questions.map(async (question, index) => ({
        ...await this.preValidateQuestion(question),
        questionIndex: index
      }))
    );

    return {
      totalQuestions: questions.length,
      validQuestions: results.filter(r => r.isValid).length,
      criticalIssues: results.filter(r => r.severity === 'critical').length,
      results
    };
  }

  /**
   * Enhanced validation with improved placeholder detection - supports all difficulties
   */
  static quickValidate(question: QuestionToValidate): ValidationResult {
    const issues: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Basic validation checks
    if (!question.text || question.text.trim().length < 20) {
      issues.push('Question text is too short (minimum 20 characters)');
      severity = 'high';
    }

    if (!question.option_a || !question.option_b || !question.option_c || !question.option_d) {
      issues.push('All four options must be provided');
      severity = 'critical';
    }

    if (!question.correct_answer) {
      issues.push('Correct answer must be specified');
      severity = 'critical';
    }

    // Check if correct answer matches one of the options
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];
    if (!options.includes(question.correct_answer)) {
      issues.push('Correct answer must match one of the four options');
      severity = 'critical';
    }

    // Validate difficulty level - now supports all three
    if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
      issues.push('Invalid difficulty level - must be easy, medium, or hard');
      severity = 'critical';
    }

    // Enhanced placeholder pattern detection
    const placeholderPatterns = [
      'correct answer for',
      'option a for',
      'option b for', 
      'option c for',
      'option d for',
      'incorrect option',
      '[country]',
      '[capital]',
      'placeholder',
      'methodology a',
      'methodology b', 
      'methodology c',
      'methodology d',
      'approach a',
      'approach b',
      'approach c', 
      'approach d',
      'technique a',
      'technique b',
      'technique c',
      'technique d',
      'method a',
      'method b',
      'method c',
      'method d',
      'with specialized parameters',
      'with novel framework',
      'with enhanced precision',
      'with optimized protocols',
      'advanced methodology',
      'cutting-edge approach',
      'innovative technique',
      'state-of-the-art method'
    ];

    const hasPlaceholders = [
      question.text,
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d
    ].some(text => 
      text && placeholderPatterns.some(pattern => 
        text.toLowerCase().includes(pattern.toLowerCase())
      )
    );

    if (hasPlaceholders) {
      issues.push('Contains generic placeholder text - questions must have specific, factual content');
      severity = 'critical';
    }

    // Check for duplicate options
    const uniqueOptions = new Set(options.filter(opt => opt && opt.trim()));
    if (uniqueOptions.size < options.filter(opt => opt).length) {
      issues.push('Duplicate answer options detected');
      if (severity === 'low') severity = 'medium';
    }

    // Check for vague or generic content
    const genericPhrases = [
      'various factors',
      'multiple elements',
      'different aspects',
      'several components',
      'numerous features'
    ];

    const hasGenericContent = [question.text, ...options].some(text =>
      text && genericPhrases.some(phrase => 
        text.toLowerCase().includes(phrase.toLowerCase())
      )
    );

    if (hasGenericContent) {
      issues.push('Content is too generic - questions should be specific and factual');
      if (severity === 'low') severity = 'medium';
    }

    return {
      isValid: issues.length === 0,
      issues,
      severity,
      questionText: question.text ? question.text.substring(0, 60) + '...' : 'No text'
    };
  }
}
