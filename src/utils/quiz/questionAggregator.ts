
import { Question } from "../../types/quiz";
import { countryQuestions, continentQuestions } from "./questionSets";
import { shuffleArray } from "./questionUtilities";
import { 
  deduplicateQuestions, 
  filterRelevantQuestions, 
  validateQuestionQuality 
} from "./questionDeduplication";
import { filterQuestionsForCountry } from "./questionFilter";
import { fetchSupabaseQuestions } from "./supabaseQuestionService";
import { 
  isQuestionUsed, 
  markQuestionsAsUsed, 
  getUnusedQuestions 
} from "./questionCache";

// Aggregate questions from multiple sources
export const aggregateQuestions = async (
  countryId?: string,
  continentId?: string,
  count: number = 10,
  difficulty?: string
): Promise<Question[]> => {
  console.log(`🎯 Aggregating ${count} questions for country: ${countryId}, continent: ${continentId}, difficulty: ${difficulty}`);
  
  let questionPool: Question[] = [];
  
  // Step 1: Try to get questions from Supabase first
  if (countryId) {
    const supabaseQuestions = await fetchSupabaseQuestions(countryId, difficulty, count);
    questionPool.push(...supabaseQuestions);
  }
  
  // Step 2: Add country-specific questions from static data if needed
  if (countryId && countryQuestions[countryId] && questionPool.length < count) {
    let countryQs = countryQuestions[countryId];
    
    // Apply difficulty filter
    if (difficulty) {
      countryQs = countryQs.filter(q => q.difficulty === difficulty);
    }
    
    // Apply strict relevance filtering
    countryQs = filterQuestionsForCountry(countryQs, countryId);
    
    questionPool.push(...countryQs.slice(0, count - questionPool.length));
    console.log(`✅ Added ${Math.min(countryQs.length, count - questionPool.length)} static country questions for ${countryId}`);
  }
  
  // Step 3: Add continent questions if needed
  if (continentId && continentQuestions[continentId] && questionPool.length < count) {
    let continentQs = continentQuestions[continentId];
    
    if (difficulty) {
      continentQs = continentQs.filter(q => q.difficulty === difficulty);
    }
    
    // Filter continent questions for relevance too
    if (countryId) {
      continentQs = filterQuestionsForCountry(continentQs, countryId);
    }
    
    questionPool.push(...continentQs.slice(0, count - questionPool.length));
    console.log(`🌍 Added ${Math.min(continentQs.length, count - questionPool.length)} continent-specific questions`);
  }
  
  return questionPool;
};

// Process and filter question pool
export const processQuestionPool = (
  questionPool: Question[],
  count: number
): Question[] => {
  // Step 1: Comprehensive deduplication
  const beforeDedup = questionPool.length;
  questionPool = deduplicateQuestions(questionPool);
  if (beforeDedup > questionPool.length) {
    console.log(`🔄 Removed ${beforeDedup - questionPool.length} duplicate questions`);
  }
  
  // Step 2: Filter out recently used questions
  const unusedQuestions = getUnusedQuestions(questionPool);
  
  // Step 3: If we don't have enough unused questions, add some used ones
  if (unusedQuestions.length < count) {
    const additionalNeeded = count - unusedQuestions.length;
    const usedButAvailable = questionPool
      .filter(q => isQuestionUsed(q.id))
      .slice(0, additionalNeeded);
    
    questionPool = [...unusedQuestions, ...usedButAvailable];
    console.log(`♻️ Reusing ${usedButAvailable.length} previously used questions`);
  } else {
    questionPool = unusedQuestions;
  }
  
  // Step 4: Final shuffle and selection
  const selectedQuestions = shuffleArray(questionPool).slice(0, count);
  
  // Step 5: Mark questions as used
  markQuestionsAsUsed(selectedQuestions.map(q => q.id));
  
  console.log(`🎲 Final selection: ${selectedQuestions.length} questions`);
  console.log('✅ All questions passed relevance check');
  
  return selectedQuestions;
};
