
import { Question, QuizResult } from "../../types/quiz";
import { countryQuestions, continentQuestions } from "./questionSets";
import { QuizService } from "../../services/supabase/quizService";

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
export const getMostFailedQuestions = async (count: number = 10): Promise<Question[]> => {
  // Sort question IDs by failure count
  const sortedIds = Object.entries(failedQuestions)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  if (!sortedIds.length) return [];
  
  // Get actual question objects from all available sources
  const allQuestions = [
    ...Object.values(countryQuestions).flat(),
    ...Object.values(continentQuestions).flat()
  ];
  
  // Try to get additional questions from Supabase if needed
  try {
    // This would require implementing a method to get questions by IDs
    // For now, we'll use the static questions
  } catch (error) {
    console.error('Failed to fetch questions from Supabase:', error);
  }
  
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
