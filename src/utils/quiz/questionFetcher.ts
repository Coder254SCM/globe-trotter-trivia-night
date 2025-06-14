
import { Question } from "../../types/quiz";
import { runStartupAudit, isAuditCompleted } from "./auditRunner";
import { aggregateQuestions, processQuestionPool } from "./questionAggregator";
import { 
  hasQuestionsForCountry,
  getQuestionCountForCountry,
  getRecentlyUpdatedQuestions,
  getQuestionsByDifficulty,
  getQuestionAuditResults,
  getCountryRelevanceScore
} from "./questionStats";

// Main question fetching function
export const getQuizQuestions = async (
  countryId?: string,
  continentId?: string,
  count: number = 10,
  includeGlobal: boolean = true,
  difficulty?: string
): Promise<Question[]> => {
  if (!isAuditCompleted()) {
    runStartupAudit();
  }
  
  // Aggregate questions from all sources
  const questionPool = await aggregateQuestions(
    countryId, 
    continentId, 
    count, 
    difficulty
  );
  
  // Process and filter the question pool
  return processQuestionPool(questionPool, count);
};

// Re-export utility functions
export {
  hasQuestionsForCountry,
  getQuestionCountForCountry,
  getRecentlyUpdatedQuestions,
  getQuestionsByDifficulty,
  getQuestionAuditResults,
  getCountryRelevanceScore
};
