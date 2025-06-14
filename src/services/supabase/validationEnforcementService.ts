
import { QuestionValidationService, QuestionToValidate, ValidationResult } from "./questionValidationService";

/**
 * Central validation enforcement service - ALL QUESTIONS MUST PASS THROUGH THIS
 */
export class ValidationEnforcementService {
  
  /**
   * MANDATORY validation gate - NO questions can bypass this
   */
  static async enforceValidation(questions: QuestionToValidate[]): Promise<{
    passed: boolean;
    validatedQuestions: QuestionToValidate[];
    rejectedQuestions: Array<{ question: QuestionToValidate; issues: string[] }>;
    summary: string;
  }> {
    console.log(`🛡️ VALIDATION ENFORCEMENT: Processing ${questions.length} questions...`);
    
    try {
      // Batch validate all questions
      const validationResults = await QuestionValidationService.batchValidateQuestions(questions);
      
      const validatedQuestions: QuestionToValidate[] = [];
      const rejectedQuestions: Array<{ question: QuestionToValidate; issues: string[] }> = [];
      
      // Process each question based on validation results
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const result = validationResults.results[i];
        
        // STRICT ENFORCEMENT: Reject ANY question with issues
        if (!result.isValid || result.severity === 'critical') {
          rejectedQuestions.push({
            question,
            issues: result.issues
          });
          console.warn(`❌ REJECTED: Question ${i + 1} - ${result.issues.join(', ')}`);
        } else {
          validatedQuestions.push(question);
          console.log(`✅ APPROVED: Question ${i + 1} passed validation`);
        }
      }
      
      const summary = `VALIDATION SUMMARY: ${validatedQuestions.length}/${questions.length} questions approved, ${rejectedQuestions.length} rejected`;
      console.log(`📊 ${summary}`);
      
      return {
        passed: rejectedQuestions.length === 0,
        validatedQuestions,
        rejectedQuestions,
        summary
      };
      
    } catch (error) {
      console.error('❌ VALIDATION ENFORCEMENT FAILED:', error);
      throw new Error(`Validation enforcement failed: ${error.message}`);
    }
  }
  
  /**
   * Pre-flight validation check for question generators
   */
  static async preFlightCheck(sampleQuestions: QuestionToValidate[]): Promise<{
    canProceed: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    console.log(`🔍 PRE-FLIGHT CHECK: Analyzing ${sampleQuestions.length} sample questions...`);
    
    try {
      const enforcementResult = await this.enforceValidation(sampleQuestions);
      
      const issues: string[] = [];
      const recommendations: string[] = [];
      
      if (!enforcementResult.passed) {
        issues.push(`${enforcementResult.rejectedQuestions.length} questions failed validation`);
        
        // Analyze common issues
        const commonIssues = new Map<string, number>();
        enforcementResult.rejectedQuestions.forEach(rejected => {
          rejected.issues.forEach(issue => {
            commonIssues.set(issue, (commonIssues.get(issue) || 0) + 1);
          });
        });
        
        // Add specific recommendations based on common issues
        commonIssues.forEach((count, issue) => {
          if (issue.includes('placeholder')) {
            recommendations.push('Remove all placeholder text from question templates');
          }
          if (issue.includes('correct answer')) {
            recommendations.push('Ensure correct_answer matches exactly one of the four options');
          }
          if (issue.includes('too short')) {
            recommendations.push('Expand question text to be more descriptive (minimum 20 characters)');
          }
        });
      }
      
      return {
        canProceed: enforcementResult.passed,
        issues,
        recommendations
      };
      
    } catch (error) {
      console.error('❌ Pre-flight check failed:', error);
      return {
        canProceed: false,
        issues: ['Pre-flight validation check failed'],
        recommendations: ['Fix validation service before generating questions']
      };
    }
  }
  
  /**
   * Get validation statistics across all systems
   */
  static async getValidationStats(): Promise<{
    totalQuestionsChecked: number;
    validationSuccessRate: number;
    commonIssues: Array<{ issue: string; frequency: number }>;
    systemStatus: string;
  }> {
    // This would track validation statistics over time
    // For now, return basic status
    return {
      totalQuestionsChecked: 0,
      validationSuccessRate: 100,
      commonIssues: [],
      systemStatus: 'VALIDATION ENFORCEMENT ACTIVE ✅'
    };
  }
}
