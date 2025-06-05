
import { Question } from "../../types/quiz";
import countries from "../../data/countries";
import { generateGenericCountryQuestions } from "../countryDataUtilities";
import { generateAllCountryQuestions } from "./countryGenerator";
import globalQuestions from "../../data/questions/globalQuestions";
import africaQuestions from "../../data/questions/continents/africaQuestions";

// Import all existing country-specific question sets
import kenyaQuestions from "../../data/questions/countries/kenyaQuestions";
import usaQuestions from "../../data/questions/countries/usaQuestions";
import japanQuestions from "../../data/questions/countries/japanQuestions";
import brazilQuestions from "../../data/questions/countries/brazilQuestions";
import italyQuestions from "../../data/questions/countries/italyQuestions";
import indiaQuestions from "../../data/questions/countries/indiaQuestions";
import australiaQuestions from "../../data/questions/countries/australiaQuestions";
import franceQuestions from "../../data/questions/countries/franceQuestions";
import chinaQuestions from "../../data/questions/countries/chinaQuestions";
import southAfricaQuestions from "../../data/questions/countries/southAfricaQuestions";
import mexicoQuestions from "../../data/questions/countries/mexicoQuestions";
import egyptQuestions from "../../data/questions/countries/egyptQuestions";
import germanyQuestions from "../../data/questions/countries/germanyQuestions";
import colombiaQuestions from "../../data/questions/countries/colombiaQuestions";
import newZealandQuestions from "../../data/questions/countries/newZealandQuestions";

// Create comprehensive country questions for ALL 195 countries
const buildAllCountryQuestions = (): Record<string, Question[]> => {
  console.log("🏗️ Building comprehensive question database for all 195 countries...");
  
  // Start with existing predefined question sets (high-quality, hand-crafted)
  const questionSets: Record<string, Question[]> = {
    "kenya": kenyaQuestions,
    "usa": usaQuestions,
    "japan": japanQuestions,
    "brazil": brazilQuestions,
    "italy": italyQuestions,
    "india": indiaQuestions,
    "australia": australiaQuestions,
    "france": franceQuestions,
    "china": chinaQuestions,
    "south-africa": southAfricaQuestions,
    "mexico": mexicoQuestions,
    "egypt": egyptQuestions,
    "germany": germanyQuestions,
    "colombia": colombiaQuestions,
    "new-zealand": newZealandQuestions,
  };
  
  // Generate questions for ALL countries that don't have specific question sets
  const allCountries = countries;
  let generatedCount = 0;
  let existingCount = Object.keys(questionSets).length;
  
  allCountries.forEach(country => {
    if (!questionSets[country.id]) {
      // Generate comprehensive questions for this country
      const countrySpecificQuestions = generateGenericCountryQuestions(country);
      
      // Add some filtered global questions relevant to this country's categories
      const relevantGlobalQuestions = globalQuestions
        .filter(q => country.categories.includes(q.category))
        .slice(0, 5); // Limit to 5 additional questions
      
      // Combine country-specific and relevant global questions
      questionSets[country.id] = [
        ...countrySpecificQuestions,
        ...relevantGlobalQuestions
      ];
      
      generatedCount++;
    }
  });
  
  console.log(`✅ Question database complete:`);
  console.log(`   - Hand-crafted countries: ${existingCount}`);
  console.log(`   - Generated countries: ${generatedCount}`);
  console.log(`   - Total countries covered: ${allCountries.length}`);
  console.log(`   - Total question sets: ${Object.keys(questionSets).length}`);
  
  // Verify we have all 195 countries
  const missingCountries = allCountries.filter(country => !questionSets[country.id]);
  if (missingCountries.length > 0) {
    console.error(`🚨 Missing question sets for: ${missingCountries.map(c => c.name).join(", ")}`);
  } else {
    console.log("🎉 ALL 195 COUNTRIES HAVE QUESTION SETS!");
  }
  
  return questionSets;
};

// Build the complete country question set for all 195 countries
export const countryQuestions = buildAllCountryQuestions();

// Define continent questions
export const continentQuestions: Record<string, Question[]> = {
  "africa": africaQuestions,
  // Add more continent questions as they're created
};

// Export statistics for monitoring
export const getQuestionStats = () => {
  const stats = {
    totalCountries: countries.length,
    countriesWithQuestions: Object.keys(countryQuestions).length,
    totalQuestions: Object.values(countryQuestions).reduce((sum, questions) => sum + questions.length, 0),
    averageQuestionsPerCountry: Object.values(countryQuestions).reduce((sum, questions) => sum + questions.length, 0) / Object.keys(countryQuestions).length,
    continents: Object.keys(continentQuestions).length,
  };
  
  console.log("📊 Question Database Statistics:", stats);
  return stats;
};
