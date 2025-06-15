
export function isValidQuestion(questionData: any): boolean {
  if (!questionData || !questionData.text || questionData.text.length < 20) return false;
  if (!questionData.options || questionData.options.length !== 4) return false;
  if (!questionData.correct || !questionData.options.includes(questionData.correct)) return false;
  
  // Check for unique options
  const uniqueOptions = new Set(questionData.options);
  if (uniqueOptions.size !== 4) return false;
  
  // Check for placeholder patterns
  const placeholderPatterns = [
    'correct answer for', 'option a for', 'option b for', 'option c for', 'option d for',
    'placeholder', 'methodology', 'approach', 'technique', 'method'
  ];
  
  const allText = [questionData.text, ...questionData.options].join(' ').toLowerCase();
  for (const pattern of placeholderPatterns) {
    if (allText.includes(pattern)) return false;
  }
  
  return true;
}
