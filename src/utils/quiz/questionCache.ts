
// Question caching and rotation utilities

// Set to track used questions to prevent repetition within sessions
let usedQuestionIds: Set<string> = new Set();

// Reset used questions every hour to allow rotation
setInterval(() => {
  usedQuestionIds.clear();
  console.log('Cleared used questions cache for fresh rotation');
}, 3600000);

export const isQuestionUsed = (questionId: string): boolean => {
  return usedQuestionIds.has(questionId);
};

export const markQuestionAsUsed = (questionId: string): void => {
  usedQuestionIds.add(questionId);
};

export const markQuestionsAsUsed = (questionIds: string[]): void => {
  questionIds.forEach(id => usedQuestionIds.add(id));
};

export const getUnusedQuestions = <T extends { id: string }>(questions: T[]): T[] => {
  return questions.filter(q => !usedQuestionIds.has(q.id));
};

export const clearQuestionCache = (): void => {
  usedQuestionIds.clear();
};

export const getCacheSize = (): number => {
  return usedQuestionIds.size;
};
