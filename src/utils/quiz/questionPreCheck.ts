
export interface QuestionPreCheckResult {
  isValid: boolean;
  issues: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface QuestionToCheck {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  country_name?: string;
  category: string;
}

// Comprehensive pre-check system for questions
export const performQuestionPreCheck = (question: QuestionToCheck): QuestionPreCheckResult => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

  const questionText = question.text.toLowerCase();
  const countryName = question.country_name?.toLowerCase() || '';
  const options = [question.option_a, question.option_b, question.option_c, question.option_d];

  // CRITICAL: Check for placeholder text patterns
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
    questionText.includes(pattern.toLowerCase())
  );

  const hasPlaceholderInOptions = options.some(option =>
    placeholderPatterns.some(pattern => 
      option?.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  if (hasPlaceholderInText || hasPlaceholderInOptions) {
    issues.push('CRITICAL: Contains placeholder text that must be replaced');
    severity = 'critical';
    recommendations.push('Replace all placeholder text with actual content');
  }

  // HIGH: Check for generic/template questions
  if (questionText.includes('what is the') && questionText.length < 50) {
    issues.push('Question appears too generic or template-like');
    if (severity !== 'critical') severity = 'high';
    recommendations.push('Make question more specific and detailed');
  }

  // HIGH: Check if question mentions assigned country
  if (countryName && !questionText.includes(countryName)) {
    // Check if it mentions other countries instead
    const commonCountries = ['france', 'germany', 'italy', 'spain', 'japan', 'china', 'india', 'brazil'];
    const mentionsOtherCountry = commonCountries.some(country => 
      country !== countryName && questionText.includes(country)
    );
    
    if (mentionsOtherCountry) {
      issues.push('Question may be assigned to wrong country');
      if (severity !== 'critical') severity = 'high';
      recommendations.push('Verify country assignment matches question content');
    }
  }

  // MEDIUM: Check answer option quality
  const allOptionsShort = options.every(option => option && option.length < 10);
  if (allOptionsShort) {
    issues.push('All answer options are very short - may lack detail');
    if (severity === 'low') severity = 'medium';
    recommendations.push('Expand answer options with more descriptive text');
  }

  // LOW: Check for duplicate options
  const uniqueOptions = new Set(options.filter(opt => opt && opt.trim()));
  if (uniqueOptions.size < options.filter(opt => opt).length) {
    issues.push('Some answer options appear to be duplicates');
    recommendations.push('Ensure all answer options are unique');
  }

  // Check correct answer validity
  if (!options.includes(question.correct_answer)) {
    issues.push('CRITICAL: Correct answer does not match any of the provided options');
    severity = 'critical';
    recommendations.push('Ensure correct_answer exactly matches one of the four options');
  }

  return {
    isValid: issues.length === 0,
    issues,
    severity,
    recommendations
  };
};

// Batch pre-check for multiple questions
export const batchPreCheck = (questions: QuestionToCheck[]): {
  totalQuestions: number;
  validQuestions: number;
  criticalIssues: number;
  highIssues: number;
  results: Array<QuestionPreCheckResult & { questionIndex: number; questionText: string }>;
} => {
  const results = questions.map((question, index) => ({
    ...performQuestionPreCheck(question),
    questionIndex: index,
    questionText: question.text.substring(0, 60) + '...'
  }));

  return {
    totalQuestions: questions.length,
    validQuestions: results.filter(r => r.isValid).length,
    criticalIssues: results.filter(r => r.severity === 'critical').length,
    highIssues: results.filter(r => r.severity === 'high').length,
    results
  };
};
