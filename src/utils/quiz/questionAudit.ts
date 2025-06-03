
import { Question } from "../../types/quiz";
import { countryQuestions } from "./questionSets";
import countries from "../../data/countries";

interface CountryAuditResult {
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

interface CategoryAuditResult {
  category: string;
  totalQuestions: number;
  correctlyPlaced: number;
  misplaced: number;
  accuracy: number;
}

interface GlobalAuditResult {
  totalCountries: number;
  countriesWithQuestions: number;
  totalQuestions: number;
  relevantQuestions: number;
  irrelevantQuestions: number;
  duplicateQuestions: number;
  brokenImages: number;
  overallRelevanceScore: number;
  countryResults: CountryAuditResult[];
  categoryResults: CategoryAuditResult[];
  recommendations: string[];
}

// Check if a question is relevant to a specific country
const isQuestionRelevantToCountry = (question: Question, countryId: string): boolean => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return false;

  const countryName = country.name.toLowerCase();
  const questionText = question.text.toLowerCase();
  const explanation = question.explanation?.toLowerCase() || "";
  
  // Check for direct country mentions
  if (questionText.includes(countryName) || explanation.includes(countryName)) {
    return true;
  }
  
  // Check for capital city mentions
  if (country.capital && (questionText.includes(country.capital.toLowerCase()) || explanation.includes(country.capital.toLowerCase()))) {
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
const isImageValid = async (imageUrl: string): Promise<boolean> => {
  if (!imageUrl) return true; // No image is fine
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Find duplicate questions across all countries
const findDuplicateQuestions = (): Map<string, string[]> => {
  const questionFingerprints = new Map<string, string[]>();
  
  Object.entries(countryQuestions).forEach(([countryId, questions]) => {
    questions.forEach(question => {
      const fingerprint = question.text.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (!questionFingerprints.has(fingerprint)) {
        questionFingerprints.set(fingerprint, []);
      }
      questionFingerprints.get(fingerprint)!.push(`${countryId}:${question.id}`);
    });
  });
  
  // Return only fingerprints with duplicates
  const duplicates = new Map<string, string[]>();
  questionFingerprints.forEach((locations, fingerprint) => {
    if (locations.length > 1) {
      duplicates.set(fingerprint, locations);
    }
  });
  
  return duplicates;
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

// Audit questions by category
export const auditQuestionsByCategory = (): CategoryAuditResult[] => {
  const categoryStats = new Map<string, { total: number; correct: number }>();
  
  Object.entries(countryQuestions).forEach(([countryId, questions]) => {
    questions.forEach(question => {
      const category = question.category;
      
      if (!categoryStats.has(category)) {
        categoryStats.set(category, { total: 0, correct: 0 });
      }
      
      const stats = categoryStats.get(category)!;
      stats.total++;
      
      if (isQuestionRelevantToCountry(question, countryId)) {
        stats.correct++;
      }
    });
  });
  
  return Array.from(categoryStats.entries()).map(([category, stats]) => ({
    category,
    totalQuestions: stats.total,
    correctlyPlaced: stats.correct,
    misplaced: stats.total - stats.correct,
    accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
  }));
};

// Comprehensive global audit
export const performGlobalAudit = async (): Promise<GlobalAuditResult> => {
  console.log("Starting comprehensive question audit...");
  
  const duplicates = findDuplicateQuestions();
  const countryResults: CountryAuditResult[] = [];
  
  let totalQuestions = 0;
  let totalRelevant = 0;
  let totalIrrelevant = 0;
  let totalBrokenImages = 0;
  
  // Audit each country
  for (const country of countries) {
    const result = await auditCountryQuestions(country.id);
    countryResults.push(result);
    
    totalQuestions += result.totalQuestions;
    totalRelevant += result.relevantQuestions;
    totalIrrelevant += result.irrelevantQuestions;
    totalBrokenImages += result.brokenImages;
  }
  
  // Calculate duplicate count per country
  duplicates.forEach((locations, fingerprint) => {
    locations.forEach(location => {
      const [countryId] = location.split(':');
      const countryResult = countryResults.find(r => r.countryId === countryId);
      if (countryResult) {
        countryResult.duplicateQuestions++;
      }
    });
  });
  
  const categoryResults = auditQuestionsByCategory();
  const overallRelevanceScore = totalQuestions > 0 ? (totalRelevant / totalQuestions) * 100 : 0;
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (overallRelevanceScore < 80) {
    recommendations.push("Overall question relevance is below 80%. Review and improve question-to-country matching.");
  }
  
  if (duplicates.size > 0) {
    recommendations.push(`Found ${duplicates.size} duplicate question sets. Implement deduplication.`);
  }
  
  if (totalBrokenImages > 0) {
    recommendations.push(`${totalBrokenImages} broken images found. Update image URLs.`);
  }
  
  const countriesWithoutQuestions = countries.length - countryResults.filter(r => r.totalQuestions > 0).length;
  if (countriesWithoutQuestions > 0) {
    recommendations.push(`${countriesWithoutQuestions} countries have no questions. Generate questions for all countries.`);
  }
  
  return {
    totalCountries: countries.length,
    countriesWithQuestions: countryResults.filter(r => r.totalQuestions > 0).length,
    totalQuestions,
    relevantQuestions: totalRelevant,
    irrelevantQuestions: totalIrrelevant,
    duplicateQuestions: duplicates.size,
    brokenImages: totalBrokenImages,
    overallRelevanceScore,
    countryResults,
    categoryResults,
    recommendations
  };
};

// Generate a detailed audit report
export const generateAuditReport = async (): Promise<string> => {
  const audit = await performGlobalAudit();
  
  let report = `
# Question Database Audit Report
Generated: ${new Date().toISOString()}

## Executive Summary
- **Total Countries**: ${audit.totalCountries}
- **Countries with Questions**: ${audit.countriesWithQuestions}
- **Total Questions**: ${audit.totalQuestions}
- **Overall Relevance Score**: ${audit.overallRelevanceScore.toFixed(1)}%
- **Broken Images**: ${audit.brokenImages}
- **Duplicate Questions**: ${audit.duplicateQuestions}

## Category Performance
${audit.categoryResults.map(cat => 
  `- **${cat.category}**: ${cat.accuracy.toFixed(1)}% accuracy (${cat.correctlyPlaced}/${cat.totalQuestions} correct)`
).join('\n')}

## Countries with Lowest Relevance Scores
${audit.countryResults
  .filter(c => c.totalQuestions > 0)
  .sort((a, b) => a.relevanceScore - b.relevanceScore)
  .slice(0, 10)
  .map(c => `- **${c.countryName}**: ${c.relevanceScore.toFixed(1)}% (${c.relevantQuestions}/${c.totalQuestions} relevant)`)
  .join('\n')}

## Recommendations
${audit.recommendations.map(rec => `- ${rec}`).join('\n')}

## Detailed Issues
${audit.countryResults
  .filter(c => c.issues.length > 0)
  .map(c => `\n### ${c.countryName}\n${c.issues.map(issue => `- ${issue}`).join('\n')}`)
  .join('\n')}
`;

  return report;
};
