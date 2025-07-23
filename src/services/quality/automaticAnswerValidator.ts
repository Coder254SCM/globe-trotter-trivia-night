
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
        suggestions.push(`Replace with actual capital: ${country.capital}`);
        correctedOptions[capitalIndex] = country.capital || 'Unknown';
      }
      
      // Verify correct answer is actually the capital
      if (country.capital && correctAnswer !== country.capital) {
        issues.push(`Incorrect capital city. Should be ${country.capital}`);
        suggestions.push(`Update correct answer to ${country.capital}`);
      }
    }
    
    // Currency question validation
    if (questionLower.includes('currency')) {
      // Add currency validation logic
    }
    
    // Population question validation
    if (questionLower.includes('population')) {
      // Add population validation logic
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(options.filter(opt => opt && opt.trim()));
    if (uniqueOptions.size < options.filter(opt => opt).length) {
      issues.push('Duplicate answer options found');
      suggestions.push('Ensure all options are unique');
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
    
    // Capital city questions
    if (questionLower.includes('capital')) {
      const otherCapitals = countries
        .filter(c => c.id !== countryId && c.capital && c.capital !== correctAnswer)
        .map(c => c.capital)
        .filter((capital): capital is string => capital !== undefined);
      
      // Get 3 random other capitals
      const shuffled = otherCapitals.sort(() => 0.5 - Math.random());
      const wrongAnswers = shuffled.slice(0, 3);
      
      return [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    }
    
    // Add more question types here
    
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
