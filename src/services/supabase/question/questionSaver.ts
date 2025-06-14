
import { supabase } from "@/integrations/supabase/client";
import { QuestionValidationService } from "../questionValidationService";
import { Question } from "./questionTypes";

export class QuestionSaver {
  /**
   * Save questions with STRICT validation enforcement
   */
  static async saveQuestions(questions: any[]): Promise<void> {
    if (!questions?.length) {
      throw new Error('No questions provided to save');
    }

    console.log(`🔍 STRICT VALIDATION: Processing ${questions.length} questions...`);
    
    const validatedQuestions = [];
    let rejectedCount = 0;

    for (const question of questions) {
      // STRICT validation - reject any question with issues
      const validation = await QuestionValidationService.preValidateQuestion(question);
      
      if (!validation.isValid || validation.severity === 'critical') {
        console.log(`❌ REJECTED: ${validation.questionText} - Issues: ${validation.issues.join(', ')}`);
        rejectedCount++;
        continue;
      }

      // Additional strict checks for placeholder content
      if (this.hasPlaceholderContent(question)) {
        console.log(`❌ REJECTED: Placeholder content detected in question: ${question.text?.substring(0, 60)}...`);
        rejectedCount++;
        continue;
      }

      // Ensure explanation exists and is meaningful
      if (!question.explanation || question.explanation.length < 20) {
        question.explanation = this.generateMeaningfulExplanation(question);
      }

      validatedQuestions.push(question);
    }

    console.log(`✅ VALIDATION COMPLETE: ${validatedQuestions.length} valid, ${rejectedCount} rejected`);

    if (validatedQuestions.length === 0) {
      throw new Error('No valid questions to save after strict validation');
    }

    // Save only validated questions
    const { error } = await supabase
      .from('questions')
      .insert(validatedQuestions);

    if (error) {
      console.error('Database save error:', error);
      throw error;
    }

    console.log(`💾 Successfully saved ${validatedQuestions.length} high-quality questions`);
  }

  /**
   * Enhanced placeholder detection
   */
  private static hasPlaceholderContent(question: any): boolean {
    const placeholderPatterns = [
      // Generic methodologies
      /methodology [a-d]/i,
      /approach [a-d]/i,
      /technique [a-d]/i,
      /method [a-d]/i,
      
      // Generic descriptors
      /with specialized parameters/i,
      /with novel framework/i,
      /with enhanced precision/i,
      /with optimized protocols/i,
      
      // Academic buzzwords without substance
      /advanced methodology/i,
      /cutting-edge approach/i,
      /innovative technique/i,
      /state-of-the-art method/i,
      
      // Obvious placeholders
      /option [a-d] for/i,
      /correct answer for/i,
      /placeholder/i,
      /\[country\]/i,
      /\[capital\]/i
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

  /**
   * Generate meaningful explanations based on correct answer
   */
  private static generateMeaningfulExplanation(question: any): string {
    const baseExplanations = {
      'Geography': `The correct answer is ${question.correct_answer}. This geographical fact is important for understanding the country's physical characteristics and location.`,
      'Culture': `The correct answer is ${question.correct_answer}. This cultural aspect reflects the traditions and heritage of the country.`,
      'History': `The correct answer is ${question.correct_answer}. This historical fact is significant in understanding the country's development and heritage.`,
      'Politics': `The correct answer is ${question.correct_answer}. This reflects the current political structure and governance system.`,
      'Economy': `The correct answer is ${question.correct_answer}. This economic factor plays a crucial role in the country's development and trade.`
    };

    return baseExplanations[question.category] || 
           `The correct answer is ${question.correct_answer}. This fact is important for understanding this aspect of the country.`;
  }

  /**
   * Validate individual question before saving
   */
  static async validateQuestion(question: any): Promise<{ isValid: boolean; errors: string[] }> {
    const validation = await QuestionValidationService.preValidateQuestion(question);
    
    return {
      isValid: validation.isValid && validation.severity !== 'critical',
      errors: validation.issues
    };
  }
}
