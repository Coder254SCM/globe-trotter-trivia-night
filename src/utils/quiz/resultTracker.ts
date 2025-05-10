
import { Question, QuizResult } from "../../types/quiz";
import globalQuestions from "../../data/questions/globalQuestions";
import { countryQuestions, continentQuestions } from "./questionSets";

// Track failed questions globally for spaced repetition
let failedQuestions: Record<string, number> = {};

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
