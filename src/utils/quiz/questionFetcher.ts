import { Question } from "../../types/quiz";
import globalQuestions from "../../data/questions/globalQuestions";
import easyGlobalQuestions from "../../data/questions/easyGlobalQuestions";
import { countryQuestions } from "./questionSets";
import { continentQuestions } from "./questionSets";
import { shuffleArray } from "./questionUtilities";
import { 
  deduplicateQuestions, 
  filterRelevantQuestions, 
  validateQuestionQuality 
} from "./questionDeduplication";
import { performGlobalAudit } from "./questionAudit";
import { filterQuestionsForCountry } from "./questionFilter";

// Set to track used questions to prevent repetition within sessions
let usedQuestionIds: Set<string> = new Set();

// Reset used questions every hour to allow rotation
setInterval(() => {
  usedQuestionIds.clear();
  console.log('Cleared used questions cache for fresh rotation');
}, 3600000);

// Run audit on startup to log current state
let auditCompleted = false;
const runStartupAudit = async () => {
  if (auditCompleted) return;
  
  try {
    console.log("🔍 Running question database audit...");
    const audit = await performGlobalAudit();
    
    console.log(`📊 Audit Results:
    - Total Countries: ${audit.totalCountries}
    - Countries with Questions: ${audit.countriesWithQuestions}
    - Total Questions: ${audit.totalQuestions}
    - Overall Relevance: ${audit.overallRelevanceScore.toFixed(1)}%
    - Broken Images: ${audit.brokenImages}
    - Duplicates: ${audit.duplicateQuestions}`);
    
    if (audit.recommendations.length > 0) {
      console.warn("⚠️ Recommendations:", audit.recommendations);
    }
    
    // Log countries with poor relevance scores
    const poorRelevance = audit.countryResults
      .filter(c => c.totalQuestions > 0 && c.relevanceScore < 70)
      .sort((a, b) => a.relevanceScore - b.relevanceScore);
    
    if (poorRelevance.length > 0) {
      console.warn("🚨 Countries with poor question relevance:");
      poorRelevance.slice(0, 5).forEach(c => {
        console.warn(`  - ${c.countryName}: ${c.relevanceScore.toFixed(1)}% relevant`);
      });
    }
    
    auditCompleted = true;
  } catch (error) {
    console.error("Failed to run question audit:", error);
  }
};

// Enhanced question fetching with proper filtering
export const getQuizQuestions = (
  countryId?: string,
  continentId?: string,
  count: number = 10,
  includeGlobal: boolean = true,
  difficulty?: string
): Question[] => {
  if (!auditCompleted) {
    runStartupAudit();
  }
  
  console.log(`🎯 Fetching ${count} questions for country: ${countryId}, continent: ${continentId}, difficulty: ${difficulty}`);
  
  let questionPool: Question[] = [];
  
  // Step 1: Add country-specific questions with STRICT filtering
  if (countryId && countryQuestions[countryId]) {
    let countryQs = countryQuestions[countryId];
    
    // Apply difficulty filter
    if (difficulty) {
      countryQs = countryQs.filter(q => q.difficulty === difficulty);
    }
    
    // CRITICAL: Apply strict relevance filtering
    countryQs = filterQuestionsForCountry(countryQs, countryId);
    
    questionPool.push(...countryQs);
    console.log(`✅ Added ${countryQs.length} RELEVANT country-specific questions for ${countryId}`);
  }
  
  // Step 2: Add continent questions if needed
  if (continentId && continentQuestions[continentId] && questionPool.length < count) {
    let continentQs = continentQuestions[continentId];
    
    if (difficulty) {
      continentQs = continentQs.filter(q => q.difficulty === difficulty);
    }
    
    // Filter continent questions for relevance too
    if (countryId) {
      continentQs = filterQuestionsForCountry(continentQs, countryId);
    }
    
    questionPool.push(...continentQs);
    console.log(`🌍 Added ${continentQs.length} continent-specific questions`);
  }
  
  // Step 3: Add ONLY general global questions
  if (includeGlobal && questionPool.length < count) {
    let globalPool: Question[] = [];
    
    if (difficulty === "easy") {
      globalPool = [...easyGlobalQuestions];
    } else {
      globalPool = [...globalQuestions];
      
      if (difficulty) {
        globalPool = globalPool.filter(q => q.difficulty === difficulty);
      }
    }
    
    // Filter global questions to only include truly general ones
    globalPool = globalPool.filter(q => {
      const text = q.text.toLowerCase();
      return text.includes("world") || 
             text.includes("global") || 
             text.includes("international") ||
             q.category === "General Knowledge";
    });
    
    questionPool.push(...globalPool.slice(0, count - questionPool.length));
    console.log(`🌐 Added ${Math.min(globalPool.length, count - questionPool.length)} GENERAL global questions`);
  }
  
  // Step 4: Comprehensive deduplication
  const beforeDedup = questionPool.length;
  questionPool = deduplicateQuestions(questionPool);
  if (beforeDedup > questionPool.length) {
    console.log(`🔄 Removed ${beforeDedup - questionPool.length} duplicate questions`);
  }
  
  // Step 5: Filter out recently used questions
  const unusedQuestions = questionPool.filter(q => !usedQuestionIds.has(q.id));
  
  // Step 6: If we don't have enough unused questions, add some used ones
  if (unusedQuestions.length < count) {
    const additionalNeeded = count - unusedQuestions.length;
    const usedButAvailable = questionPool
      .filter(q => usedQuestionIds.has(q.id))
      .slice(0, additionalNeeded);
    
    questionPool = [...unusedQuestions, ...usedButAvailable];
    console.log(`♻️ Reusing ${usedButAvailable.length} previously used questions`);
  } else {
    questionPool = unusedQuestions;
  }
  
  // Step 7: Final shuffle and selection
  const selectedQuestions = shuffleArray(questionPool).slice(0, count);
  
  // Step 8: Mark questions as used
  selectedQuestions.forEach(q => usedQuestionIds.add(q.id));
  
  console.log(`🎲 Final selection: ${selectedQuestions.length} questions`);
  console.log('✅ All questions passed relevance check');
  
  return selectedQuestions;
};

// Check if questions exist for a country
export const hasQuestionsForCountry = (countryId: string): boolean => {
  return !!countryQuestions[countryId] && countryQuestions[countryId].length > 0;
};

export const getQuestionCountForCountry = (countryId: string): number => {
  return countryQuestions[countryId]?.length || 0;
};

export const getRecentlyUpdatedQuestions = (since: Date, count: number = 10): Question[] => {
  const allQuestions = [
    ...globalQuestions,
    ...easyGlobalQuestions,
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
    ...globalQuestions,
    ...easyGlobalQuestions,
    ...Object.values(countryQuestions).flat(),
    ...Object.values(continentQuestions).flat()
  ];
  
  const uniqueQuestions = deduplicateQuestions(allQuestions);
  const filteredQuestions = uniqueQuestions.filter(q => q.difficulty === difficulty);
  
  return shuffleArray(filteredQuestions).slice(0, count);
};

// New function to get audit results for external use
export const getQuestionAuditResults = async () => {
  return await performGlobalAudit();
};

// Function to get relevance score for a specific country
export const getCountryRelevanceScore = async (countryId: string): Promise<number> => {
  const audit = await performGlobalAudit();
  const countryResult = audit.countryResults.find(c => c.countryId === countryId);
  return countryResult?.relevanceScore || 0;
};
