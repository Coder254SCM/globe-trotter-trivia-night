
import { Question } from "../../types/quiz";
import countries from "../../data/countries";

// Local question generation has been disabled following a data purge.
// The system now relies solely on the Supabase database for all questions.

const buildAllCountryQuestions = (): Record<string, Question[]> => {
  console.log("PURGED: Local question generation is disabled. All questions must come from the database.");
  return {};
};

// Build the complete country question set, which is now empty.
export const countryQuestions = buildAllCountryQuestions();

// Define continent questions, which are also empty.
export const continentQuestions: Record<string, Question[]> = {};

// Export statistics for monitoring
export const getQuestionStats = () => {
  const totalQuestions = Object.values(countryQuestions).reduce((sum, questions) => sum + questions.length, 0);
  const countryCount = Object.keys(countryQuestions).length;

  const stats = {
    totalCountries: countries.length,
    countriesWithQuestions: countryCount,
    totalQuestions: totalQuestions,
    averageQuestionsPerCountry: countryCount > 0 ? totalQuestions / countryCount : 0,
    continents: Object.keys(continentQuestions).length,
  };
  
  console.log("📊 Local Question Database Statistics (post-purge):", stats);
  return stats;
};
