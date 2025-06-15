
// Enhanced question caching and rotation utilities

// Set to track used questions to prevent repetition within sessions
let usedQuestionIds: Set<string> = new Set();

// Track when cache was last cleared
let lastCacheReset = Date.now();

// Reset used questions every 30 minutes for fresh rotation
const CACHE_RESET_INTERVAL = 30 * 60 * 1000; // 30 minutes

const checkAndResetCache = () => {
  const now = Date.now();
  if (now - lastCacheReset > CACHE_RESET_INTERVAL) {
    usedQuestionIds.clear();
    lastCacheReset = now;
    console.log('🔄 Cleared used questions cache for fresh rotation');
  }
};

export const isQuestionUsed = (questionId: string): boolean => {
  checkAndResetCache();
  return usedQuestionIds.has(questionId);
};

export const markQuestionAsUsed = (questionId: string): void => {
  checkAndResetCache();
  usedQuestionIds.add(questionId);
};

export const markQuestionsAsUsed = (questionIds: string[]): void => {
  checkAndResetCache();
  questionIds.forEach(id => usedQuestionIds.add(id));
  console.log(`📝 Marked ${questionIds.length} questions as used (total used: ${usedQuestionIds.size})`);
};

export const getUnusedQuestions = <T extends { id: string }>(questions: T[]): T[] => {
  checkAndResetCache();
  const unused = questions.filter(q => !usedQuestionIds.has(q.id));
  console.log(`🔍 Found ${unused.length}/${questions.length} unused questions`);
  return unused;
};

export const clearQuestionCache = (): void => {
  usedQuestionIds.clear();
  lastCacheReset = Date.now();
  console.log('🗑️ Manually cleared question cache');
};

export const getCacheSize = (): number => {
  checkAndResetCache();
  return usedQuestionIds.size;
};

export const getCacheInfo = () => {
  checkAndResetCache();
  return {
    usedCount: usedQuestionIds.size,
    lastReset: new Date(lastCacheReset).toLocaleTimeString(),
    timeUntilReset: Math.max(0, CACHE_RESET_INTERVAL - (Date.now() - lastCacheReset))
  };
};
