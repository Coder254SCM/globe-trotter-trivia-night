
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

// Set to track used questions to prevent repetition within sessions
let usedQuestionIds: Set<string> = new Set();

// Reset used questions every hour to allow rotation
setInterval(() => {
  usedQuestionIds.clear();
  console.log('Cleared used questions cache for fresh rotation');
}, 3600000);

// Get questions for a specific quiz with enhanced filtering
export const getQuizQuestions = (
  countryId?: string,
  continentId?: string,
  count: number = 10,
  includeGlobal: boolean = true,
  difficulty?: string
): Question[] => {
  console.log(`Fetching ${count} questions for country: ${countryId}, continent: ${continentId}, difficulty: ${difficulty}`);
  
  let questionPool: Question[] = [];
  
  // Step 1: Add country-specific questions
  if (countryId && countryQuestions[countryId]) {
    let countryQs = countryQuestions[countryId];
    
    // Filter by difficulty if specified
    if (difficulty) {
      countryQs = countryQs.filter(q => q.difficulty === difficulty);
    }
    
    // Validate quality and filter for relevance
    countryQs = countryQs
      .filter(validateQuestionQuality)
      .filter(q => filterRelevantQuestions([q], countryId)[0]);
    
    questionPool.push(...countryQs);
    console.log(`Added ${countryQs.length} country-specific questions for ${countryId}`);
  }
  
  // Step 2: Add continent-specific questions if needed
  if (continentId && continentQuestions[continentId] && questionPool.length < count) {
    let continentQs = continentQuestions[continentId];
    
    if (difficulty) {
      continentQs = continentQs.filter(q => q.difficulty === difficulty);
    }
    
    continentQs = continentQs
      .filter(validateQuestionQuality)
      .filter(q => filterRelevantQuestions([q], undefined, continentId)[0]);
    
    questionPool.push(...continentQs);
    console.log(`Added ${continentQs.length} continent-specific questions for ${continentId}`);
  }
  
  // Step 3: Add global questions to fill remaining slots
  if (includeGlobal && questionPool.length < count) {
    let globalPool: Question[] = [];
    
    if (difficulty === "easy") {
      globalPool = [...easyGlobalQuestions];
    } else {
      globalPool = [...globalQuestions];
      
      // If difficulty specified, filter global questions too
      if (difficulty) {
        globalPool = globalPool.filter(q => q.difficulty === difficulty);
      }
    }
    
    // Validate and filter global questions
    globalPool = globalPool.filter(validateQuestionQuality);
    
    // Only add questions that don't duplicate existing content
    const existingFingerprints = new Set(
      questionPool.map(q => q.text.toLowerCase().replace(/[^\w\s]/g, '').trim())
    );
    
    const uniqueGlobalQuestions = globalPool.filter(q => {
      const fingerprint = q.text.toLowerCase().replace(/[^\w\s]/g, '').trim();
      return !existingFingerprints.has(fingerprint);
    });
    
    questionPool.push(...uniqueGlobalQuestions);
    console.log(`Added ${uniqueGlobalQuestions.length} global questions`);
  }
  
  // Step 4: Comprehensive deduplication
  questionPool = deduplicateQuestions(questionPool);
  
  // Step 5: Filter out recently used questions
  const unusedQuestions = questionPool.filter(q => !usedQuestionIds.has(q.id));
  
  // Step 6: If we don't have enough unused questions, add some used ones
  if (unusedQuestions.length < count) {
    const additionalNeeded = count - unusedQuestions.length;
    const usedButAvailable = questionPool
      .filter(q => usedQuestionIds.has(q.id))
      .slice(0, additionalNeeded);
    
    questionPool = [...unusedQuestions, ...usedButAvailable];
  } else {
    questionPool = unusedQuestions;
  }
  
  // Step 7: Final shuffle and selection
  const selectedQuestions = shuffleArray(questionPool).slice(0, count);
  
  // Step 8: Mark questions as used
  selectedQuestions.forEach(q => usedQuestionIds.add(q.id));
  
  console.log(`Final selection: ${selectedQuestions.length} questions`);
  console.log('Question breakdown:', selectedQuestions.map(q => ({
    id: q.id,
    category: q.category,
    difficulty: q.difficulty,
    text: q.text.substring(0, 50) + '...'
  })));
  
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
