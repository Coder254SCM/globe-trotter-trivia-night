
import { QuestionValidationService, QuestionToValidate } from "./questionValidationService";

/**
 * Simplified validation enforcement service
 */
export class ValidationEnforcementService {
  
  /**
   * Basic validation gate for questions
   */
  static async enforceValidation(questions: QuestionToValidate[]): Promise<{
    passed: boolean;
    validatedQuestions: QuestionToValidate[];
    rejectedQuestions: Array<{ question: QuestionToValidate; issues: string[] }>;
    summary: string;
  }> {
    console.log(`🛡️ Validating ${questions.length} questions...`);
    
    try {
      const validatedQuestions: QuestionToValidate[] = [];
      const rejectedQuestions: Array<{ question: QuestionToValidate; issues: string[] }> = [];
      
      for (const question of questions) {
        const result = await QuestionValidationService.preValidateQuestion(question);
        
        if (result.isValid && result.severity !== 'critical') {
          validatedQuestions.push(question);
        } else {
          rejectedQuestions.push({
            question,
            issues: result.issues
          });
        }
      }
      
      const summary = `${validatedQuestions.length}/${questions.length} questions approved, ${rejectedQuestions.length} rejected`;
      console.log(`📊 Validation complete: ${summary}`);
      
      return {
        passed: rejectedQuestions.length === 0,
        validatedQuestions,
        rejectedQuestions,
        summary
      };
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      return {
        passed: false,
        validatedQuestions: [],
        rejectedQuestions: questions.map(q => ({ 
          question: q, 
          issues: ['Validation system error'] 
        })),
        summary: 'Validation system error'
      };
    }
  }
  
  /**
   * Pre-flight validation check
   */
  static async preFlightCheck(sampleQuestions: QuestionToValidate[]): Promise<{
    canProceed: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const enforcementResult = await this.enforceValidation(sampleQuestions);
      
      const issues: string[] = [];
      const recommendations: string[] = [];
      
      if (!enforcementResult.passed) {
        issues.push(`${enforcementResult.rejectedQuestions.length} questions failed validation`);
        recommendations.push('Fix validation issues before proceeding');
      }
      
      return {
        canProceed: enforcementResult.passed,
        issues,
        recommendations
      };
      
    } catch (error) {
      return {
        canProceed: false,
        issues: ['Pre-flight validation failed'],
        recommendations: ['Check validation service']
      };
    }
  }
}
