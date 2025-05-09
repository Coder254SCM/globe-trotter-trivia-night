
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
import colombiaQuestions from "../data/questions/countries/colombiaQuestions";
import countries from "../data/countries";
import { generateGenericCountryQuestions } from "./countryDataUtilities";

// Create specialized question sets for countries that don't have specific questions yet
const generateCountrySpecificQuestions = (countryId: string): Question[] => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return [];
  
  // Generate country-specific questions using the utility function
  const countrySpecificQuestions = generateGenericCountryQuestions(country);
  
  // Get global questions related to the country's categories
  const categoryQuestions = globalQuestions
    .filter(q => country.categories.includes(q.category))
    .slice(0, Math.min(5, country.categories.length));
  
  // Mix both types of questions
  return [...countrySpecificQuestions, ...categoryQuestions];
};

// Create a comprehensive mapping of all country questions
// This ensures every country in the world has at least some basic questions
const buildAllCountryQuestions = (): Record<string, Question[]> => {
  // Start with existing predefined question sets
  const questionSets: Record<string, Question[]> = {
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
    "germany": germanyQuestions,
    "colombia": colombiaQuestions,
  };
  
  // Add specifically filtered global questions for some important countries
  const globalQuestionSets: Record<string, Question[]> = {
    "new-zealand": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Wildlife" || q.category === "History"
    ).slice(0, 10),
    "canada": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "History" || q.category === "Wildlife"
    ).slice(0, 10),
    "russia": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Geography" || q.category === "Politics"
    ).slice(0, 10),
    "argentina": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "Sports"
    ).slice(0, 10),
    "spain": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Culture" || q.category === "Art"
    ).slice(0, 10),
    "thailand": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "Religion"
    ).slice(0, 10),
    "nigeria": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "History" || q.category === "Culture"
    ).slice(0, 10),
    "united-kingdom": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Culture" || q.category === "Literature"
    ).slice(0, 10),
    "morocco": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "History"
    ).slice(0, 10),
    "ghana": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "History" || q.category === "Culture"
    ).slice(0, 10),
    "sweden": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "History"
    ).slice(0, 10),
    "greece": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Art" || q.category === "Philosophy"
    ).slice(0, 10),
  };
  
  // Merge the predefined sets with filtered sets
  Object.entries(globalQuestionSets).forEach(([countryId, questions]) => {
    questionSets[countryId] = questions;
  });
  
  // Generate questions for ALL countries that don't have specific question sets
  countries.forEach(country => {
    if (!questionSets[country.id]) {
      questionSets[country.id] = generateCountrySpecificQuestions(country.id);
    }
  });
  
  return questionSets;
};

// Build the complete country question set
const countryQuestions = buildAllCountryQuestions();

const continentQuestions: Record<string, Question[]> = {
  "africa": africaQuestions,
  // Add more continent questions as they're created
};

// Track failed questions globally for spaced repetition
let failedQuestions: Record<string, number> = {};

// Prevent showing the same question multiple times in a session
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
