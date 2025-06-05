
import countries from "../../data/countries";
import { countryQuestions } from "./questionSets";
import { getActualCountryStats } from "./countryDataFixer";

export const checkProjectTruth = () => {
  console.log("🕵️ CHECKING PROJECT TRUTH...");
  
  const stats = getActualCountryStats();
  const questionStats = {
    countriesWithQuestions: Object.keys(countryQuestions).length,
    totalQuestions: Object.values(countryQuestions).reduce((sum, questions) => sum + questions.length, 0)
  };

  const truth = {
    claimedCountries: 195,
    actualCountries: stats.totalCountries,
    countriesWithQuestions: questionStats.countriesWithQuestions,
    countriesWithoutQuestions: stats.totalCountries - questionStats.countriesWithQuestions,
    truthScore: (stats.totalCountries / 195) * 100,
    questionsNeedWork: questionStats.totalQuestions,
    isComplete: stats.totalCountries >= 195 && questionStats.countriesWithQuestions >= 195
  };

  console.log("🚨 PROJECT TRUTH REPORT:");
  console.log(`Claimed: ${truth.claimedCountries} countries`);
  console.log(`Actual: ${truth.actualCountries} countries`);
  console.log(`With Questions: ${truth.countriesWithQuestions} countries`);
  console.log(`Without Questions: ${truth.countriesWithoutQuestions} countries`);
  console.log(`Truth Score: ${truth.truthScore.toFixed(1)}%`);
  console.log(`Project Complete: ${truth.isComplete ? 'NO' : 'YES'}`);

  return truth;
};
