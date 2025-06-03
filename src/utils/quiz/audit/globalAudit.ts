
import countries from "../../../data/countries";
import { auditCountryQuestions, CountryAuditResult } from "./countryAudit";
import { auditQuestionsByCategory, CategoryAuditResult } from "./categoryAudit";
import { findDuplicateQuestions } from "./duplicateDetection";

export interface GlobalAuditResult {
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
