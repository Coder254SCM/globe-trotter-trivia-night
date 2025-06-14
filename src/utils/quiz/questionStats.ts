
import { Question } from "../../types/quiz";
import { countryQuestions, continentQuestions } from "./questionSets";
import { deduplicateQuestions } from "./questionDeduplication";
import { performGlobalAudit } from "./questionAudit";
import { shuffleArray } from "./questionUtilities";

// Check if questions exist for a country
export const hasQuestionsForCountry = (countryId: string): boolean => {
  return !!countryQuestions[countryId] && countryQuestions[countryId].length > 0;
};

export const getQuestionCountForCountry = (countryId: string): number => {
  return countryQuestions[countryId]?.length || 0;
};

export const getRecentlyUpdatedQuestions = (since: Date, count: number = 10): Question[] => {
  const allQuestions = [
    ...Object.values(countryQuestions).flat(),
    ...Object.values(continentQuestions).flat()
  ];
  
  const uniqueQuestions = deduplicateQuestions(allQuestions);
  
  const recentQuestions = uniqueQuestions
    .filter(q => q.lastUpdated && new Date(q.lastUpdated) > since)
    .sort((a, b) => {
      if (!a.lastUpdated || !b.lastUpdated) return 0;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  
  return recentQuestions.slice(0, count);
};

export const getQuestionsByDifficulty = (difficulty: string, count: number = 10): Question[] => {
  const allQuestions = [
    ...Object.values(countryQuestions).flat(),
    ...Object.values(continentQuestions).flat()
  ];
  
  const uniqueQuestions = deduplicateQuestions(allQuestions);
  const filteredQuestions = uniqueQuestions.filter(q => q.difficulty === difficulty);
  
  return shuffleArray(filteredQuestions).slice(0, count);
};

// Function to get audit results for external use
export const getQuestionAuditResults = async () => {
  return await performGlobalAudit();
};

// Function to get relevance score for a specific country
export const getCountryRelevanceScore = async (countryId: string): Promise<number> => {
  const audit = await performGlobalAudit();
  const countryResult = audit.countryResults.find(c => c.countryId === countryId);
  return countryResult?.relevanceScore || 0;
};
