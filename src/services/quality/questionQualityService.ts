
import { supabase } from "@/integrations/supabase/client";
import countries from "@/data/countries";

export interface QualityIssue {
  type: 'incorrect_answer' | 'duplicate_option' | 'irrelevant_option' | 'poor_question' | 'missing_correct_answer';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion?: string;
}

export interface QuestionQualityResult {
  questionId: string;
  questionText: string;
  isValid: boolean;
  issues: QualityIssue[];
  qualityScore: number;
  autoFixSuggestions: string[];
}

export class QuestionQualityService {
  /**
   * Comprehensive question quality audit
   */
  static async auditQuestion(question: any): Promise<QuestionQualityResult> {
    const issues: QualityIssue[] = [];
    const autoFixSuggestions: string[] = [];
    
    // Get country information
    const country = countries.find(c => c.id === question.country_id);
    const countryName = country?.name.toLowerCase() || '';
    const capital = country?.capital?.toLowerCase() || '';
    
    // Check 1: Question relevance to country
    const questionText = question.text.toLowerCase();
    if (!questionText.includes(countryName) && !questionText.includes(capital)) {
      issues.push({
        type: 'irrelevant_option',
        severity: 'high',
        description: `Question doesn't mention ${country?.name} or relate to the assigned country`,
        suggestion: `Rewrite question to be specific to ${country?.name}`
      });
    }
    
    // Check 2: Answer options validation
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];
    const correctAnswer = question.correct_answer;
    
    // Check for country name as answer option when asking about capital
    if (questionText.includes('capital') && options.some(opt => opt?.toLowerCase() === countryName)) {
      issues.push({
        type: 'incorrect_answer',
        severity: 'critical',
        description: `Country name "${country?.name}" appears as answer option for capital question`,
        suggestion: `Replace with actual capital city: ${country?.capital}`
      });
      
      autoFixSuggestions.push(`Replace "${country?.name}" with "${country?.capital}" in answer options`);
    }
    
    // Check 3: Correct answer validation
    if (!options.includes(correctAnswer)) {
      issues.push({
        type: 'missing_correct_answer',
        severity: 'critical',
        description: 'Correct answer not found in options',
        suggestion: 'Ensure correct answer matches one of the four options'
      });
    }
    
    // Check 4: Duplicate options
    const uniqueOptions = new Set(options.filter(opt => opt && opt.trim()));
    if (uniqueOptions.size < options.filter(opt => opt).length) {
      issues.push({
        type: 'duplicate_option',
        severity: 'high',
        description: 'Duplicate answer options found',
        suggestion: 'Ensure all options are unique'
      });
    }
    
    // Check 5: Geography question validation
    if (question.category === 'Geography') {
      await this.validateGeographyQuestion(question, country, issues, autoFixSuggestions);
    }
    
    // Calculate quality score
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    
    const qualityScore = Math.max(0, 100 - (criticalIssues * 40) - (highIssues * 20) - (mediumIssues * 10));
    
    return {
      questionId: question.id,
      questionText: question.text,
      isValid: criticalIssues === 0 && highIssues === 0,
      issues,
      qualityScore,
      autoFixSuggestions
    };
  }
  
  /**
   * Validate geography-specific questions
   */
  private static async validateGeographyQuestion(
    question: any,
    country: any,
    issues: QualityIssue[],
    autoFixSuggestions: string[]
  ): Promise<void> {
    const questionText = question.text.toLowerCase();
    const options = [question.option_a, question.option_b, question.option_c, question.option_d];
    
    // Capital city questions
    if (questionText.includes('capital')) {
      const correctCapital = country?.capital;
      if (correctCapital && question.correct_answer !== correctCapital) {
        issues.push({
          type: 'incorrect_answer',
          severity: 'critical',
          description: `Incorrect capital city. Should be ${correctCapital}`,
          suggestion: `Set correct answer to ${correctCapital}`
        });
        
        autoFixSuggestions.push(`Update correct answer to "${correctCapital}"`);
      }
      
      // Check if country name appears as option
      if (options.some(opt => opt?.toLowerCase() === country?.name.toLowerCase())) {
        autoFixSuggestions.push(`Replace "${country?.name}" with a different capital city`);
      }
    }
    
    // Currency questions
    if (questionText.includes('currency')) {
      // Add currency validation logic here
    }
    
    // Population questions
    if (questionText.includes('population')) {
      // Add population validation logic here
    }
  }
  
  /**
   * Auto-fix common issues
   */
  static async autoFixQuestion(questionId: string): Promise<boolean> {
    try {
      const { data: question } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();
        
      if (!question) return false;
      
      const country = countries.find(c => c.id === question.country_id);
      if (!country) return false;
      
      let needsUpdate = false;
      const updates: any = {};
      
      // Fix capital questions
      if (question.text.toLowerCase().includes('capital')) {
        const options = [question.option_a, question.option_b, question.option_c, question.option_d];
        const countryNameIndex = options.findIndex(opt => 
          opt?.toLowerCase() === country.name.toLowerCase()
        );
        
        if (countryNameIndex !== -1) {
          // Replace country name with correct capital
          const optionKey = ['option_a', 'option_b', 'option_c', 'option_d'][countryNameIndex];
          updates[optionKey] = country.capital;
          updates.correct_answer = country.capital;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await supabase
          .from('questions')
          .update(updates)
          .eq('id', questionId);
          
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Auto-fix failed:', error);
      return false;
    }
  }
  
  /**
   * Batch audit all questions
   */
  static async auditAllQuestions(countryId?: string): Promise<QuestionQualityResult[]> {
    let query = supabase.from('questions').select('*');
    
    if (countryId) {
      query = query.eq('country_id', countryId);
    }
    
    const { data: questions } = await query;
    if (!questions) return [];
    
    const results: QuestionQualityResult[] = [];
    
    for (const question of questions) {
      const result = await this.auditQuestion(question);
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Get quality statistics
   */
  static async getQualityStats(): Promise<{
    totalQuestions: number;
    validQuestions: number;
    criticalIssues: number;
    averageQualityScore: number;
    issuesByType: Record<string, number>;
  }> {
    const { data: questions } = await supabase.from('questions').select('*');
    if (!questions) return {
      totalQuestions: 0,
      validQuestions: 0,
      criticalIssues: 0,
      averageQualityScore: 0,
      issuesByType: {}
    };
    
    const results = await Promise.all(
      questions.map(q => this.auditQuestion(q))
    );
    
    const validQuestions = results.filter(r => r.isValid).length;
    const criticalIssues = results.filter(r => 
      r.issues.some(i => i.severity === 'critical')
    ).length;
    
    const averageQualityScore = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;
    
    const issuesByType: Record<string, number> = {};
    results.forEach(result => {
      result.issues.forEach(issue => {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
      });
    });
    
    return {
      totalQuestions: questions.length,
      validQuestions,
      criticalIssues,
      averageQualityScore,
      issuesByType
    };
  }
}
