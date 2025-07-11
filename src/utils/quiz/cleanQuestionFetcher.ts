
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";
import { markQuestionsAsUsed, getUnusedQuestions } from "./questionCache";
import { deduplicateQuestions } from "./questionDeduplication";

/**
 * Simple and reliable question fetcher with duplicate prevention
 */
export const getCleanQuizQuestions = async (
  countryId: string,
  difficulty: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🔍 [CleanFetcher] Fetching ${count} ${difficulty} questions for ${countryId}`);

  try {
    // Fetch more questions than needed to allow for filtering out used ones
    const fetchCount = Math.max(count * 3, 30);

    const allQuestions = await QuestionService.getFilteredQuestions({
      countryId,
      difficulty,
      limit: fetchCount,
      validateContent: false
    });

    console.log(`📋 [CleanFetcher] Found ${allQuestions.length} total questions`);

    if (allQuestions.length === 0) {
      return [];
    }

    // Filter out previously used questions
    let unusedQuestions = getUnusedQuestions(allQuestions);

    // Deduplicate unused questions by text
    unusedQuestions = deduplicateQuestions(unusedQuestions);
    console.log(`🔄 [CleanFetcher] ${unusedQuestions.length} deduped & unused questions available`);

    let questionsToReturn: Question[];
    if (unusedQuestions.length >= count) {
      questionsToReturn = unusedQuestions.slice(0, count);
    } else {
      // Not enough unused unique questions, fall back to all deduped questions
      const allDeduped = deduplicateQuestions(allQuestions);
      questionsToReturn = allDeduped.slice(0, count);
    }

    // Mark these questions as used
    markQuestionsAsUsed(questionsToReturn.map(q => q.id));

    console.log(
      `✅ [CleanFetcher] Returning ${questionsToReturn.length} unique questions (${questionsToReturn.length} newly used)`
    );
    return questionsToReturn;

  } catch (error) {
    console.error('❌ [CleanFetcher] Error fetching questions:', error);
    return [];
  }
};

/**
 * Get questions for weekly challenge with rotation
 */
export const getWeeklyChallengeQuestions = async (count: number = 20): Promise<Question[]> => {
  console.log(`🏆 [CleanFetcher] Fetching ${count} questions for weekly challenge`);

  try {
    const allQuestions = await QuestionService.getFilteredQuestions({
      difficulty: 'medium',
      limit: count * 2, // Fetch more for variety
      validateContent: false
    });

    // Deduplicate and filter unused
    let unusedQuestions = getUnusedQuestions(allQuestions);
    unusedQuestions = deduplicateQuestions(unusedQuestions);
    let questionsToReturn: Question[];

    if (unusedQuestions.length >= count) {
      questionsToReturn = unusedQuestions.slice(0, count);
    } else {
      const allDeduped = deduplicateQuestions(allQuestions);
      questionsToReturn = allDeduped.slice(0, count);
    }

    markQuestionsAsUsed(questionsToReturn.map(q => q.id));

    console.log(`✅ [CleanFetcher] Weekly challenge: ${questionsToReturn.length} unique questions ready`);
    return questionsToReturn;
  } catch (error) {
    console.error('❌ [CleanFetcher] Weekly challenge fetch failed:', error);
    return [];
  }
};

/**
 * Get questions for ultimate quiz with strict no-repeat policy
 */
export const getUltimateQuizQuestions = async (
  userId: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🎯 [CleanFetcher] Fetching ${count} ultimate quiz questions`);

  try {
    const allQuestions = await QuestionService.getFilteredQuestions({
      difficulty: 'hard',
      limit: count * 4, // Fetch many more for ultimate quiz variety
      validateContent: false
    });

    let unusedQuestions = getUnusedQuestions(allQuestions);
    unusedQuestions = deduplicateQuestions(unusedQuestions);

    let questionsToReturn: Question[];
    if (unusedQuestions.length >= count) {
      questionsToReturn = unusedQuestions.slice(0, count);
    } else {
      const allDeduped = deduplicateQuestions(allQuestions);
      questionsToReturn = allDeduped.slice(0, count);
    }

    markQuestionsAsUsed(questionsToReturn.map(q => q.id));

    console.log(`✅ [CleanFetcher] Ultimate quiz: ${questionsToReturn.length} unique questions ready`);
    return questionsToReturn;
  } catch (error) {
    console.error('❌ [CleanFetcher] Ultimate quiz fetch failed:', error);
    return [];
  }
};
