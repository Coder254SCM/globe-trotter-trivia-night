
import countries from "../../../data/countries";
import { countryQuestions } from "../questionSets";
import { Question } from "../../../types/quiz";

interface ComprehensiveAuditResult {
  totalCountries: number;
  countriesWithQuestions: number;
  totalQuestions: number;
  relevantQuestions: number;
  irrelevantQuestions: number;
  questionsByCountry: Array<{
    countryId: string;
    countryName: string;
    totalQuestions: number;
    relevantCount: number;
    irrelevantCount: number;
    irrelevantQuestions: Array<{
      id: string;
      text: string;
      category: string;
      reason: string;
    }>;
  }>;
  overallAccuracy: number;
  recommendations: string[];
}

// Enhanced relevance checking
const isQuestionRelevantToCountry = (question: Question, countryId: string): boolean => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return false;

  const countryName = country.name.toLowerCase();
  const continent = country.continent?.toLowerCase();
  const questionText = question.text.toLowerCase();
  const questionExplanation = question.explanation?.toLowerCase() || "";
  
  // Check for direct country mentions
  if (questionText.includes(countryName) || questionExplanation.includes(countryName)) {
    return true;
  }
  
  // Geography questions should be relevant to the country's region
  if (question.category === "Geography") {
    // Allow general world geography questions
    if (questionText.includes("world") || questionText.includes("global")) {
      return true;
    }
    
    // Check for continent relevance
    if (continent && (questionText.includes(continent) || questionExplanation.includes(continent))) {
      return true;
    }
    
    // Reject questions about other specific regions
    const otherContinents = ["europe", "asia", "africa", "antarctica", "oceania", "north america", "south america"];
    const otherRegions = otherContinents.filter(c => c !== continent);
    
    for (const region of otherRegions) {
      if (questionText.includes(region) && !questionText.includes(countryName)) {
        return false;
      }
    }
  }
  
  // Culture questions should be about the country or its region
  if (question.category === "Culture") {
    return questionText.includes(countryName) || 
           questionExplanation.includes(countryName) ||
           (continent && questionText.includes(continent));
  }
  
  // History questions should be about the country or its region
  if (question.category === "History") {
    return questionText.includes(countryName) || 
           questionExplanation.includes(countryName) ||
           (continent && questionText.includes(continent));
  }
  
  return true; // Default to true for other categories
};

export const runComprehensiveAudit = (): ComprehensiveAuditResult => {
  console.log("🔍 Running comprehensive question audit...");
  
  const questionsByCountry: ComprehensiveAuditResult['questionsByCountry'] = [];
  let totalQuestions = 0;
  let totalRelevant = 0;
  let totalIrrelevant = 0;
  
  countries.forEach(country => {
    const questions = countryQuestions[country.id] || [];
    const relevantQuestions: Question[] = [];
    const irrelevantQuestions: Array<{
      id: string;
      text: string;
      category: string;
      reason: string;
    }> = [];
    
    questions.forEach(question => {
      if (isQuestionRelevantToCountry(question, country.id)) {
        relevantQuestions.push(question);
      } else {
        let reason = "Question not relevant to country";
        
        // Determine specific reason
        if (question.category === "Geography") {
          const questionText = question.text.toLowerCase();
          if (questionText.includes("europe") && country.continent !== "Europe") {
            reason = "European geography question in non-European country";
          } else if (questionText.includes("asia") && country.continent !== "Asia") {
            reason = "Asian geography question in non-Asian country";
          } else if (questionText.includes("africa") && country.continent !== "Africa") {
            reason = "African geography question in non-African country";
          }
        }
        
        irrelevantQuestions.push({
          id: question.id,
          text: question.text.substring(0, 100) + "...",
          category: question.category,
          reason
        });
      }
    });
    
    if (questions.length > 0) {
      questionsByCountry.push({
        countryId: country.id,
        countryName: country.name,
        totalQuestions: questions.length,
        relevantCount: relevantQuestions.length,
        irrelevantCount: irrelevantQuestions.length,
        irrelevantQuestions
      });
    }
    
    totalQuestions += questions.length;
    totalRelevant += relevantQuestions.length;
    totalIrrelevant += irrelevantQuestions.length;
  });
  
  // Sort by worst offenders first
  questionsByCountry.sort((a, b) => b.irrelevantCount - a.irrelevantCount);
  
  const overallAccuracy = totalQuestions > 0 ? (totalRelevant / totalQuestions) * 100 : 0;
  
  const recommendations: string[] = [];
  
  if (overallAccuracy < 80) {
    recommendations.push(`CRITICAL: Overall question accuracy is ${overallAccuracy.toFixed(1)}% - needs immediate attention`);
  }
  
  if (totalIrrelevant > 0) {
    recommendations.push(`${totalIrrelevant} irrelevant questions found and need to be removed or fixed`);
  }
  
  const countriesWithMostIssues = questionsByCountry.filter(c => c.irrelevantCount > 5);
  if (countriesWithMostIssues.length > 0) {
    recommendations.push(`${countriesWithMostIssues.length} countries have 5+ irrelevant questions`);
  }
  
  return {
    totalCountries: countries.length,
    countriesWithQuestions: questionsByCountry.length,
    totalQuestions,
    relevantQuestions: totalRelevant,
    irrelevantQuestions: totalIrrelevant,
    questionsByCountry,
    overallAccuracy,
    recommendations
  };
};
