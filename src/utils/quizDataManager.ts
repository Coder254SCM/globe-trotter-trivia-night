import { Question, QuizResult } from "../types/quiz";
import globalQuestions from "../data/questions/globalQuestions";
import africaQuestions from "../data/questions/continents/africaQuestions";
import kenyaQuestions from "../data/questions/countries/kenyaQuestions";
import usaQuestions from "../data/questions/countries/usaQuestions";
import japanQuestions from "../data/questions/countries/japanQuestions";
import brazilQuestions from "../data/questions/countries/brazilQuestions";
import italyQuestions from "../data/questions/countries/italyQuestions";
import indiaQuestions from "../data/questions/countries/indiaQuestions";
import australiaQuestions from "../data/questions/countries/australiaQuestions";
import franceQuestions from "../data/questions/countries/franceQuestions";
import chinaQuestions from "../data/questions/countries/chinaQuestions";
import southAfricaQuestions from "../data/questions/countries/southAfricaQuestions";
import mexicoQuestions from "../data/questions/countries/mexicoQuestions";
import egyptQuestions from "../data/questions/countries/egyptQuestions";
import germanyQuestions from "../data/questions/countries/germanyQuestions";
import countries from "../data/countries";

// This would be expanded as more question sets are added
const countryQuestions: Record<string, Question[]> = {
  "kenya": kenyaQuestions,
  "usa": usaQuestions,
  "japan": japanQuestions,
  "brazil": brazilQuestions,
  "italy": italyQuestions,
  "india": indiaQuestions,
  "australia": australiaQuestions,
  "france": franceQuestions,
  "china": chinaQuestions,
  "south-africa": southAfricaQuestions,
  "mexico": mexicoQuestions,
  "egypt": egyptQuestions,
  "germany": germanyQuestions
};

const continentQuestions: Record<string, Question[]> = {
  "africa": africaQuestions,
  // Add more continent questions as they're created
};

// Track failed questions globally
let failedQuestions: Record<string, number> = {};

// Get questions for a specific quiz
export const getQuizQuestions = (
  countryId?: string,
  continentId?: string,
  count: number = 10,
  includeGlobal: boolean = true
): Question[] => {
  let questionPool: Question[] = [];
  
  // Add country-specific questions if a country is selected
  if (countryId && countryQuestions[countryId]) {
    questionPool.push(...countryQuestions[countryId]);
  }
  
  // Add continent-specific questions if a continent is selected
  if (continentId && continentQuestions[continentId]) {
    questionPool.push(...continentQuestions[continentId]);
  }
  
  // Add global questions if requested and we need more questions
  if (includeGlobal && questionPool.length < count) {
    questionPool.push(...globalQuestions);
  }
  
  // If we don't have enough questions, just use what we have
  if (questionPool.length <= count) {
    return questionPool;
  }
  
  // Prioritize country-specific questions
  const countrySpecificQuestions = questionPool.filter(q => 
    countryId && countryQuestions[countryId] && 
    countryQuestions[countryId].some(cq => cq.id === q.id)
  );
  
  // If we have enough country-specific questions, use those
  if (countrySpecificQuestions.length >= count) {
    return shuffleArray(countrySpecificQuestions).slice(0, count);
  }
  
  // Otherwise, shuffle the entire pool and take the requested number
  return shuffleArray(questionPool).slice(0, count);
};

// Record failed questions
export const recordQuizResults = (result: QuizResult, questions: Question[]): void => {
  if (!result.failedQuestionIds || !result.failedQuestionIds.length) return;
  
  result.failedQuestionIds.forEach(id => {
    if (failedQuestions[id]) {
      failedQuestions[id]++;
    } else {
      failedQuestions[id] = 1;
    }
  });
};

// Get the most failed questions for weekly challenges
export const getMostFailedQuestions = (count: number = 10): Question[] => {
  // Sort question IDs by failure count
  const sortedIds = Object.entries(failedQuestions)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  if (!sortedIds.length) return [];
  
  // Get actual question objects from all available questions
  const allQuestions = [
    ...globalQuestions,
    ...Object.values(countryQuestions).flat(),
    ...Object.values(continentQuestions).flat()
  ];
  
  // Find questions by IDs in order of most failed
  const mostFailedQuestions: Question[] = [];
  
  for (const id of sortedIds) {
    const question = allQuestions.find(q => q.id === id);
    if (question) {
      mostFailedQuestions.push(question);
      if (mostFailedQuestions.length >= count) break;
    }
  }
  
  return mostFailedQuestions;
};

// Get questions updated after a certain date
export const getRecentlyUpdatedQuestions = (since: Date, count: number = 10): Question[] => {
  const allQuestions = [
    ...globalQuestions,
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

// Check if questions exist for a country
export const hasQuestionsForCountry = (countryId: string): boolean => {
  return !!countryQuestions[countryId] && countryQuestions[countryId].length > 0;
};

// Get the number of questions available for a country
export const getQuestionCountForCountry = (countryId: string): number => {
  return countryQuestions[countryId]?.length || 0;
};

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
