
import { Question } from "../../types/quiz";

// Create a unique fingerprint for each question to detect duplicates
const createQuestionFingerprint = (question: Question): string => {
  // Normalize text by removing extra spaces, punctuation, and converting to lowercase
  const normalizedText = question.text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // Include choices in fingerprint for multiple choice questions
  const choicesFingerprint = question.choices
    ?.map(choice => choice.text.toLowerCase().replace(/[^\w\s]/g, '').trim())
    .sort()
    .join('|') || '';
  
  return `${normalizedText}|${choicesFingerprint}|${question.type}`;
};

// Advanced deduplication that removes questions with similar content
export const deduplicateQuestions = (questions: Question[]): Question[] => {
  const seen = new Set<string>();
  const uniqueQuestions: Question[] = [];
  const duplicatesLog: string[] = [];
  
  questions.forEach((question, index) => {
    const fingerprint = createQuestionFingerprint(question);
    
    if (!seen.has(fingerprint)) {
      seen.add(fingerprint);
      uniqueQuestions.push(question);
    } else {
      duplicatesLog.push(`Duplicate found: "${question.text.substring(0, 50)}..." (ID: ${question.id})`);
    }
  });
  
  if (duplicatesLog.length > 0) {
    console.log(`Removed ${duplicatesLog.length} duplicate questions:`, duplicatesLog);
  }
  
  return uniqueQuestions;
};

// Ensure questions are appropriate for the given country/continent
export const filterRelevantQuestions = (
  questions: Question[], 
  countryId?: string, 
  continentId?: string
): Question[] => {
  return questions.filter(question => {
    // Always include general knowledge questions
    if (question.category === "Geography" || 
        question.category === "History" || 
        question.category === "Culture") {
      return true;
    }
    
    // For country-specific questions, check if they mention the country
    if (countryId) {
      const countryName = countryId.replace(/-/g, ' ').toLowerCase();
      const questionText = question.text.toLowerCase();
      const isRelevant = questionText.includes(countryName) ||
                        question.id.includes(countryId) ||
                        question.explanation?.toLowerCase().includes(countryName);
      
      if (isRelevant) return true;
    }
    
    // For continent-specific questions
    if (continentId) {
      const continentName = continentId.toLowerCase();
      const questionText = question.text.toLowerCase();
      const isRelevant = questionText.includes(continentName) ||
                        question.id.includes(continentId) ||
                        question.explanation?.toLowerCase().includes(continentName);
      
      if (isRelevant) return true;
    }
    
    return false;
  });
};

// Quality check for questions
export const validateQuestionQuality = (question: Question): boolean => {
  // Check for minimum requirements
  if (!question.text || question.text.length < 10) return false;
  if (!question.choices || question.choices.length < 2) return false;
  if (!question.explanation || question.explanation.length < 5) return false;
  
  // Check for placeholder text
  const placeholderTerms = ['lorem ipsum', 'placeholder', 'todo', 'tbd', 'example'];
  const textLower = question.text.toLowerCase();
  if (placeholderTerms.some(term => textLower.includes(term))) return false;
  
  // Ensure all choices have text
  if (question.choices.some(choice => !choice.text || choice.text.length < 1)) return false;
  
  // Ensure there's a correct answer
  if (!question.choices.some(choice => choice.isCorrect)) return false;
  
  return true;
};
