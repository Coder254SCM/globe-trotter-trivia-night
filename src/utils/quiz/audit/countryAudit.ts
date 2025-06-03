
import { Question } from "../../../types/quiz";
import { countryQuestions } from "../questionSets";
import countries from "../../../data/countries";

export interface CountryAuditResult {
  countryId: string;
  countryName: string;
  totalQuestions: number;
  relevantQuestions: number;
  irrelevantQuestions: number;
  duplicateQuestions: number;
  brokenImages: number;
  relevanceScore: number;
  issues: string[];
}

// Check if a question is relevant to a specific country
export const isQuestionRelevantToCountry = (question: Question, countryId: string): boolean => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return false;

  const countryName = country.name.toLowerCase();
  const questionText = question.text.toLowerCase();
  const explanation = question.explanation?.toLowerCase() || "";
  
  // Check for direct country mentions
  if (questionText.includes(countryName) || explanation.includes(countryName)) {
    return true;
  }
  
  // Check if question is about the country's categories/specialties
  if (country.categories.includes(question.category)) {
    // Additional checks for category relevance
    const categoryKeywords: Record<string, string[]> = {
      "Geography": ["location", "border", "mountain", "river", "climate", "landscape"],
      "History": ["founded", "independence", "empire", "war", "ancient", "colonial"],
      "Culture": ["tradition", "festival", "language", "custom", "heritage"],
      "Food": ["cuisine", "dish", "recipe", "cooking", "traditional food"],
      "Art": ["painting", "sculpture", "artist", "museum", "architecture"],
      "Sports": ["football", "soccer", "national sport", "olympic", "team"],
      "Politics": ["government", "president", "parliament", "democracy", "republic"],
      "Religion": ["church", "temple", "mosque", "buddhist", "christian", "muslim"]
    };
    
    const keywords = categoryKeywords[question.category] || [];
    const hasRelevantKeywords = keywords.some(keyword => 
      questionText.includes(keyword) || explanation.includes(keyword)
    );
    
    return hasRelevantKeywords;
  }
  
  return false;
};

// Check if image URL is valid and accessible
export const isImageValid = async (imageUrl: string): Promise<boolean> => {
  if (!imageUrl) return true; // No image is fine
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Audit a specific country's questions
export const auditCountryQuestions = async (countryId: string): Promise<CountryAuditResult> => {
  const country = countries.find(c => c.id === countryId);
  const questions = countryQuestions[countryId] || [];
  
  if (!country) {
    return {
      countryId,
      countryName: "Unknown",
      totalQuestions: 0,
      relevantQuestions: 0,
      irrelevantQuestions: 0,
      duplicateQuestions: 0,
      brokenImages: 0,
      relevanceScore: 0,
      issues: ["Country not found"]
    };
  }
  
  let relevantCount = 0;
  let brokenImageCount = 0;
  const issues: string[] = [];
  
  for (const question of questions) {
    // Check relevance
    if (isQuestionRelevantToCountry(question, countryId)) {
      relevantCount++;
    } else {
      issues.push(`Irrelevant question: "${question.text.substring(0, 50)}..."`);
    }
    
    // Check image validity
    if (question.imageUrl) {
      const isValid = await isImageValid(question.imageUrl);
      if (!isValid) {
        brokenImageCount++;
        issues.push(`Broken image: ${question.imageUrl}`);
      }
    }
  }
  
  const irrelevantCount = questions.length - relevantCount;
  const relevanceScore = questions.length > 0 ? (relevantCount / questions.length) * 100 : 0;
  
  return {
    countryId,
    countryName: country.name,
    totalQuestions: questions.length,
    relevantQuestions: relevantCount,
    irrelevantQuestions: irrelevantCount,
    duplicateQuestions: 0, // Will be calculated globally
    brokenImages: brokenImageCount,
    relevanceScore,
    issues
  };
};
