
import { Question } from "../../types/quiz";
import globalQuestions from "../../data/questions/globalQuestions";
import easyGlobalQuestions from "../../data/questions/easyGlobalQuestions";
import africaQuestions from "../../data/questions/continents/africaQuestions";
import { countryQuestions } from "./questionSets";
import { continentQuestions } from "./questionSets";
import { shuffleArray } from "./questionUtilities";

// Set to track used questions to prevent repetition
let usedQuestionIds: Set<string> = new Set();

// Reset used questions every few hours to allow rotation
setInterval(() => {
  usedQuestionIds.clear();
}, 3600000); // Clear every hour

// Get questions for a specific quiz
export const getQuizQuestions = (
  countryId?: string,
  continentId?: string,
  count: number = 10,
  includeGlobal: boolean = true,
  difficulty?: string
): Question[] => {
  let questionPool: Question[] = [];
  
  // Add country-specific questions if a country is selected
  if (countryId && countryQuestions[countryId]) {
    // Filter by difficulty if specified
    if (difficulty) {
      questionPool.push(...countryQuestions[countryId].filter(q => q.difficulty === difficulty));
    } else {
      questionPool.push(...countryQuestions[countryId]);
    }
  }
  
  // Add continent-specific questions if a continent is selected
  if (continentId && continentQuestions[continentId]) {
    if (difficulty) {
      questionPool.push(...continentQuestions[continentId].filter(q => q.difficulty === difficulty));
    } else {
      questionPool.push(...continentQuestions[continentId]);
    }
  }
  
  // Add global questions if requested and we need more questions
  if (includeGlobal && questionPool.length < count) {
    // Add questions from the appropriate global question set
    if (difficulty === "easy") {
      questionPool.push(...easyGlobalQuestions);
    } else {
      questionPool.push(...globalQuestions);
    }
  }
  
  // Filter out questions that have been used recently
  questionPool = questionPool.filter(q => !usedQuestionIds.has(q.id));
  
  // If we don't have enough questions, include some used ones
  if (questionPool.length < count) {
    const additionalQuestions = globalQuestions
      .filter(q => !questionPool.some(pq => pq.id === q.id))
      .slice(0, count - questionPool.length);
    
    questionPool.push(...additionalQuestions);
  }
  
  // Shuffle and pick the requested number of questions
  const selectedQuestions = shuffleArray(questionPool).slice(0, count);
  
  // Mark these questions as used
  selectedQuestions.forEach(q => usedQuestionIds.add(q.id));
  
  return selectedQuestions;
};

// Check if questions exist for a country
export const hasQuestionsForCountry = (countryId: string): boolean => {
  return !!countryQuestions[countryId] && countryQuestions[countryId].length > 0;
};

// Get the number of questions available for a country
export const getQuestionCountForCountry = (countryId: string): number => {
  return countryQuestions[countryId]?.length || 0;
};

// Get questions updated after a certain date
export const getRecentlyUpdatedQuestions = (since: Date, count: number = 10): Question[] => {
  const allQuestions = [
    ...globalQuestions,
    ...easyGlobalQuestions,
    ...Object.values(countryQuestions).flat(),
    ...Object.values(continentQuestions).flat()
  ];
  
  const recentQuestions = allQuestions
    .filter(q => q.lastUpdated && new Date(q.lastUpdated) > since)
    .sort((a, b) => {
      if (!a.lastUpdated || !b.lastUpdated) return 0;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  
  return recentQuestions.slice(0, count);
};

// Get questions by difficulty level
export const getQuestionsByDifficulty = (difficulty: string, count: number = 10): Question[] => {
  const allQuestions = [
    ...globalQuestions,
    ...easyGlobalQuestions,
    ...Object.values(countryQuestions).flat(),
    ...Object.values(continentQuestions).flat()
  ];
  
  const filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
  return shuffleArray(filteredQuestions).slice(0, count);
};
