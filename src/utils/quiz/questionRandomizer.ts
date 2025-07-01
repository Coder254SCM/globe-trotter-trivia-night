
import { Question } from "@/types/quiz";

// Randomize question order to prevent same starting questions
export function randomizeQuestions(questions: Question[]): Question[] {
  if (!questions || questions.length === 0) {
    return [];
  }
  
  const shuffled = [...questions];
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// Ensure questions are unique by text
export function ensureUniqueQuestions(questions: Question[]): Question[] {
  const seen = new Set<string>();
  const unique: Question[] = [];
  
  for (const question of questions) {
    const normalizedText = question.text.toLowerCase().trim();
    if (!seen.has(normalizedText)) {
      seen.add(normalizedText);
      unique.push(question);
    }
  }
  
  return unique;
}

// Get random subset of questions
export function getRandomQuestions(questions: Question[], count: number): Question[] {
  const unique = ensureUniqueQuestions(questions);
  const randomized = randomizeQuestions(unique);
  return randomized.slice(0, count);
}
