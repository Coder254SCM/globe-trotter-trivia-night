
/**
 * Helper function to shuffle an array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Filter questions by difficulty level
 */
export function filterQuestionsByDifficulty(questions: any[], difficulty: string): any[] {
  if (!difficulty || difficulty === 'all') {
    return questions;
  }
  return questions.filter(q => q.difficulty === difficulty);
}

/**
 * Get a random selection of items from an array
 */
export function getRandomSelection<T>(array: T[], count: number): T[] {
  if (array.length <= count) {
    return shuffleArray(array);
  }
  
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}
