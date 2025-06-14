
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
  country_id?: string;
  category: string;
}

export class QuestionValidationService {
  /**
   * Pre-validate a question using the database function
   */
  static async preValidateQuestion(question: QuestionToValidate): Promise<ValidationResult> {
    try {
      const { data, error } = await supabase.rpc('pre_validate_question', {
        p_text: question.text,
        p_option_a: question.option_a,
        p_option_b: question.option_b,
        p_option_c: question.option_c,
        p_option_d: question.option_d,
        p_correct_answer: question.correct_answer,
        p_country_id: question.country_id
      });

      if (error) {
        console.error('Validation error:', error);
        return {
          isValid: false,
          issues: ['Validation service error'],
          severity: 'critical',
          questionText: question.text.substring(0, 60) + '...'
        };
      }

      return data as ValidationResult;
    } catch (error) {
      console.error('Failed to validate question:', error);
      return {
        isValid: false,
        issues: ['Failed to connect to validation service'],
        severity: 'critical',
        questionText: question.text.substring(0, 60) + '...'
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
   * Client-side quick validation for immediate feedback
   */
  static quickValidate(question: QuestionToValidate): ValidationResult {
    const issues: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check for placeholder patterns
    const placeholderPatterns = [
      'correct answer for',
      'option a for',
      'option b for',
      'option c for', 
      'option d for',
      'incorrect option',
      '[country]',
      '[capital]',
      'placeholder'
    ];

    const hasPlaceholderInText = placeholderPatterns.some(pattern => 
      question.text.toLowerCase().includes(pattern.toLowerCase())
    );

    const hasPlaceholderInOptions = [
      question.option_a,
      question.option_b, 
      question.option_c,
      question.option_d
    ].some(option =>
      placeholderPatterns.some(pattern => 
        option?.toLowerCase().includes(pattern.toLowerCase())
      )
    );

    if (hasPlaceholderInText || hasPlaceholderInOptions) {
      issues.push('CRITICAL: Contains placeholder text that must be replaced');
      severity = 'critical';
    }

    // Validate correct answer
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];
    if (!options.includes(question.correct_answer)) {
      issues.push('CRITICAL: Correct answer does not match any option');
      severity = 'critical';
    }

    // Check for minimum length
    if (question.text.length < 20) {
      issues.push('Question text too short (minimum 20 characters)');
      if (severity !== 'critical') severity = 'high';
    }

    // Check for duplicate options
    const uniqueOptions = new Set(options.filter(opt => opt && opt.trim()));
    if (uniqueOptions.size < options.filter(opt => opt).length) {
      issues.push('Duplicate answer options detected');
      if (severity === 'low') severity = 'medium';
    }

    return {
      isValid: issues.length === 0,
      issues,
      severity,
      questionText: question.text.substring(0, 60) + '...'
    };
  }
}
