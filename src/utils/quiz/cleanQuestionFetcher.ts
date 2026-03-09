
import { Question } from "../../types/quiz";
import { QuestionService } from "../../services/supabase/questionService";
import { markQuestionsAsUsed, getUnusedQuestions } from "./questionCache";
import { deduplicateQuestions } from "./questionDeduplication";
import { generateRealQuestions } from "../../services/simple/realQuestionGenerator";
import { REAL_COUNTRY_DATA } from "../../data/realCountryData";

function resolveCountryName(countryId: string): string {
  // Try to find the country name from REAL_COUNTRY_DATA by matching the id pattern
  for (const name of Object.keys(REAL_COUNTRY_DATA)) {
    const idFromName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (idFromName === countryId || name.toLowerCase() === countryId.toLowerCase()) {
      return name;
    }
  }
  // Fallback: capitalize the id
  return countryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Simple and reliable question fetcher with duplicate prevention.
 * Falls back to client-side generation if DB has no questions.
 */
export const getCleanQuizQuestions = async (
  countryId: string,
  difficulty: string,
  count: number = 10
): Promise<Question[]> => {
  console.log(`🔍 [CleanFetcher] Fetching ${count} ${difficulty} questions for ${countryId}`);

  try {
    const fetchCount = Math.max(count * 3, 30);

    let allQuestions = await QuestionService.getFilteredQuestions({
      countryId,
      difficulty,
      limit: fetchCount,
      validateContent: false
    });

    console.log(`📋 [CleanFetcher] Found ${allQuestions.length} ${difficulty} questions from DB`);

    // Fallback: if requested difficulty is empty, use any available difficulty
    if (allQuestions.length === 0 && difficulty) {
      allQuestions = await QuestionService.getFilteredQuestions({
        countryId,
        limit: fetchCount,
        validateContent: false
      });
    }

    // If DB has no questions, generate client-side from real data
    if (allQuestions.length === 0) {
      console.log(`🔄 [CleanFetcher] No DB questions, generating client-side for ${countryId}`);
      const countryName = countryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Try all difficulties if specific one yields nothing
      const difficultiesToTry = difficulty 
        ? [difficulty as 'easy' | 'medium' | 'hard', 'easy', 'medium', 'hard'] 
        : ['easy', 'medium', 'hard'] as const;
      
      for (const diff of difficultiesToTry) {
        const generated = generateRealQuestions(
          { id: countryId, name: countryName, continent: '' },
          diff,
          count
        );
        if (generated.length > 0) {
          console.log(`✅ [CleanFetcher] Generated ${generated.length} ${diff} questions client-side`);
          return generated;
        }
      }
      return [];
    }

    // Filter out previously used questions
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
    return questionsToReturn;

  } catch (error) {
    console.error('❌ [CleanFetcher] Error fetching questions:', error);
    
    // Last resort: generate client-side
    console.log(`🔄 [CleanFetcher] Falling back to client-side generation after error`);
    const countryName = countryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return generateRealQuestions(
      { id: countryId, name: countryName, continent: '' },
      (difficulty as 'easy' | 'medium' | 'hard') || 'medium',
      count
    );
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
