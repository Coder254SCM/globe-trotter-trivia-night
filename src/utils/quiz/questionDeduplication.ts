
import { Question } from "../../types/quiz";

// Create a unique fingerprint for each question to detect duplicates
const createQuestionFingerprint = (question: Question): string => {
  const normalizedText = question.text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  const choicesFingerprint = question.choices
    ?.map(choice => choice.text.toLowerCase().replace(/[^\w\s]/g, '').trim())
    .sort()
    .join('|') || '';
  return `${normalizedText}|${choicesFingerprint}|${question.type}`;
};

// Enhanced deduplication that logs all fingerprints and duplicate clusters
export const deduplicateQuestions = (questions: Question[]): Question[] => {
  const seen = new Map<string, Question>();
  const clusters: Record<string, string[]> = {};

  questions.forEach((question, index) => {
    const fingerprint = createQuestionFingerprint(question);
    if (!clusters[fingerprint]) {
      clusters[fingerprint] = [];
    }
    clusters[fingerprint].push(`"${question.text.substring(0, 45)}..." (ID: ${question.id})`);
  });

  Object.entries(clusters).forEach(([fp, list]) => {
    if (list.length > 1) {
      console.warn(`[Deduplication] Cluster with ${list.length} dupes:`, list);
    }
  });

  const uniqueQuestions: Question[] = [];
  for (const question of questions) {
    const fingerprint = createQuestionFingerprint(question);
    if (!seen.has(fingerprint)) {
      seen.set(fingerprint, question);
      uniqueQuestions.push(question);
    }
  }
  console.log(`[Deduplication] ${Object.keys(clusters).length} unique fingerprints from ${questions.length} questions`);
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
