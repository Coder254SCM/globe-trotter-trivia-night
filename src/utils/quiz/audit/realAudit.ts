
import { Question } from "../../../types/quiz";
import { countryQuestions } from "../questionSets";
import countries from "../../../data/countries";

interface RealAuditResult {
  totalCountries: number;
  actualCountriesWithQuestions: number;
  totalQuestions: number;
  duplicateQuestions: number;
  irrelevantQuestions: number;
  accuracyPercentage: number;
  countryBreakdown: Array<{
    countryId: string;
    countryName: string;
    questionCount: number;
    hasRelevantQuestions: boolean;
    irrelevantCount: number;
    issues: string[];
  }>;
  worstOffenders: Array<{
    countryName: string;
    irrelevantCount: number;
    totalQuestions: number;
  }>;
}

// Check if question is actually relevant to the specific country
const isQuestionActuallyRelevant = (question: Question, countryId: string): boolean => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return false;

  const countryName = country.name.toLowerCase();
  const questionText = question.text.toLowerCase();
  const explanation = question.explanation?.toLowerCase() || "";

  // Direct mention = relevant
  if (questionText.includes(countryName) || explanation.includes(countryName)) {
    return true;
  }

  // Geography questions about other specific countries = irrelevant
  if (question.category === "Geography") {
    const otherCountries = countries.filter(c => c.id !== countryId);
    for (const otherCountry of otherCountries) {
      if (questionText.includes(otherCountry.name.toLowerCase()) && 
          !questionText.includes("world") && 
          !questionText.includes("global")) {
        return false;
      }
    }
  }

  // Cultural questions about other specific countries = irrelevant
  if (question.category === "Culture") {
    const otherCountries = countries.filter(c => c.id !== countryId);
    for (const otherCountry of otherCountries) {
      if (questionText.includes(otherCountry.name.toLowerCase())) {
        return false;
      }
    }
  }

  return true;
};

// Find exact duplicate questions
const findExactDuplicates = (): Map<string, string[]> => {
  const questionTexts = new Map<string, string[]>();
  
  Object.entries(countryQuestions).forEach(([countryId, questions]) => {
    questions.forEach(question => {
      const normalizedText = question.text.toLowerCase().trim();
      
      if (!questionTexts.has(normalizedText)) {
        questionTexts.set(normalizedText, []);
      }
      questionTexts.get(normalizedText)!.push(`${countryId}:${question.id}`);
    });
  });

  // Return only duplicates
  const duplicates = new Map<string, string[]>();
  questionTexts.forEach((locations, text) => {
    if (locations.length > 1) {
      duplicates.set(text, locations);
    }
  });

  return duplicates;
};

export const performRealAudit = (): RealAuditResult => {
  console.log("🔍 PERFORMING REAL COMPREHENSIVE AUDIT...");
  
  const duplicates = findExactDuplicates();
  const countryBreakdown: RealAuditResult['countryBreakdown'] = [];
  
  let totalQuestions = 0;
  let totalIrrelevant = 0;
  
  // Check each country
  countries.forEach(country => {
    const questions = countryQuestions[country.id] || [];
    const issues: string[] = [];
    let irrelevantCount = 0;
    
    questions.forEach(question => {
      if (!isQuestionActuallyRelevant(question, country.id)) {
        irrelevantCount++;
        issues.push(`IRRELEVANT: "${question.text.substring(0, 60)}..."`);
      }
    });
    
    countryBreakdown.push({
      countryId: country.id,
      countryName: country.name,
      questionCount: questions.length,
      hasRelevantQuestions: questions.length > 0 && irrelevantCount < questions.length,
      irrelevantCount,
      issues
    });
    
    totalQuestions += questions.length;
    totalIrrelevant += irrelevantCount;
  });

  // Find worst offenders
  const worstOffenders = countryBreakdown
    .filter(c => c.irrelevantCount > 0)
    .sort((a, b) => b.irrelevantCount - a.irrelevantCount)
    .slice(0, 10)
    .map(c => ({
      countryName: c.countryName,
      irrelevantCount: c.irrelevantCount,
      totalQuestions: c.questionCount
    }));

  const actualCountriesWithQuestions = countryBreakdown.filter(c => c.questionCount > 0).length;
  const accuracyPercentage = totalQuestions > 0 ? ((totalQuestions - totalIrrelevant) / totalQuestions) * 100 : 0;

  const results: RealAuditResult = {
    totalCountries: countries.length,
    actualCountriesWithQuestions,
    totalQuestions,
    duplicateQuestions: duplicates.size,
    irrelevantQuestions: totalIrrelevant,
    accuracyPercentage,
    countryBreakdown,
    worstOffenders
  };

  console.log("🚨 REAL AUDIT RESULTS:");
  console.log(`📊 Total Countries: ${results.totalCountries}`);
  console.log(`📊 Countries with Questions: ${results.actualCountriesWithQuestions}`);
  console.log(`📊 Total Questions: ${results.totalQuestions}`);
  console.log(`📊 Irrelevant Questions: ${results.irrelevantQuestions}`);
  console.log(`📊 Accuracy: ${results.accuracyPercentage.toFixed(1)}%`);
  console.log(`📊 Duplicates: ${results.duplicateQuestions}`);
  
  if (worstOffenders.length > 0) {
    console.log("\n🚨 COUNTRIES WITH MOST IRRELEVANT QUESTIONS:");
    worstOffenders.forEach(country => {
      console.log(`- ${country.countryName}: ${country.irrelevantCount}/${country.totalQuestions} irrelevant`);
    });
  }

  return results;
};
