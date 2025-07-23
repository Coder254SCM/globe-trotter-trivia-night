
import countries from "@/data/countries";

export interface AnswerValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  correctedOptions?: string[];
}

export class AutomaticAnswerValidator {
  /**
   * Validate answer options for geography questions
   */
  static validateGeographyAnswers(
    questionText: string,
    options: string[],
    correctAnswer: string,
    countryId: string
  ): AnswerValidationResult {
    const country = countries.find(c => c.id === countryId);
    if (!country) {
      return {
        isValid: false,
        issues: ['Country not found'],
        suggestions: ['Verify country ID is correct']
      };
    }
    
    const issues: string[] = [];
    const suggestions: string[] = [];
    let correctedOptions: string[] = [...options];
    
    const questionLower = questionText.toLowerCase();
    const countryName = country.name.toLowerCase();
    
    // Capital city question validation
    if (questionLower.includes('capital')) {
      const capitalIndex = options.findIndex(opt => 
        opt?.toLowerCase() === countryName
      );
      
      if (capitalIndex !== -1) {
        issues.push(`Country name "${country.name}" appears as answer option for capital question`);
        suggestions.push(`Replace with actual capital city`);
        correctedOptions[capitalIndex] = 'Different Capital'; // Generic placeholder
      }
      
      // Check for generic or placeholder answers
      const genericPatterns = ['historic period', 'different', 'another', 'other'];
      options.forEach((option, index) => {
        if (option && genericPatterns.some(pattern => option.toLowerCase().includes(pattern))) {
          issues.push(`Generic answer option found: "${option}"`);
          suggestions.push(`Replace "${option}" with specific factual answer`);
        }
      });
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(options.filter(opt => opt && opt.trim()));
    if (uniqueOptions.size < options.filter(opt => opt).length) {
      issues.push('Duplicate answer options found');
      suggestions.push('Ensure all options are unique');
    }
    
    // Check for placeholder or generic content
    const placeholderPatterns = [
      'historic period',
      'different',
      'another',
      'other',
      'various',
      'multiple',
      'option a',
      'option b',
      'option c',
      'option d'
    ];
    
    const hasPlaceholders = options.some(option => 
      option && placeholderPatterns.some(pattern => 
        option.toLowerCase().includes(pattern)
      )
    );
    
    if (hasPlaceholders) {
      issues.push('Contains generic or placeholder content');
      suggestions.push('Replace with specific, factual information');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      correctedOptions: issues.length > 0 ? correctedOptions : undefined
    };
  }
  
  /**
   * Generate better answer options for geography questions
   */
  static generateBetterAnswers(
    questionText: string,
    correctAnswer: string,
    countryId: string
  ): string[] {
    const country = countries.find(c => c.id === countryId);
    if (!country) return [];
    
    const questionLower = questionText.toLowerCase();
    
    // For independence questions, provide actual years
    if (questionLower.includes('independence')) {
      const independenceYears = ['1919', '1947', '1960', '1975'];
      return [correctAnswer, ...independenceYears.filter(year => year !== correctAnswer)].slice(0, 4);
    }
    
    // For continent questions
    if (questionLower.includes('continent')) {
      const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
      return [correctAnswer, ...continents.filter(c => c !== correctAnswer)].slice(0, 4);
    }
    
    return [];
  }
  
  /**
   * Validate and fix question in real-time
   */
  static validateAndFix(
    questionText: string,
    options: string[],
    correctAnswer: string,
    countryId: string
  ): {
    isValid: boolean;
    fixedOptions: string[];
    fixedCorrectAnswer: string;
    issues: string[];
  } {
    const validation = this.validateGeographyAnswers(
      questionText,
      options,
      correctAnswer,
      countryId
    );
    
    if (validation.isValid) {
      return {
        isValid: true,
        fixedOptions: options,
        fixedCorrectAnswer: correctAnswer,
        issues: []
      };
    }
    
    // Try to auto-fix
    const betterAnswers = this.generateBetterAnswers(questionText, correctAnswer, countryId);
    
    if (betterAnswers.length === 4) {
      return {
        isValid: false,
        fixedOptions: betterAnswers,
        fixedCorrectAnswer: correctAnswer,
        issues: validation.issues
      };
    }
    
    return {
      isValid: false,
      fixedOptions: validation.correctedOptions || options,
      fixedCorrectAnswer: correctAnswer,
      issues: validation.issues
    };
  }
}
