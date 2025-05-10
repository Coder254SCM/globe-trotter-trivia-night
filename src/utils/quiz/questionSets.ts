
import { Question } from "../../types/quiz";
import countries from "../../data/countries";
import { generateGenericCountryQuestions } from "../countryDataUtilities";
import globalQuestions from "../../data/questions/globalQuestions";
import africaQuestions from "../../data/questions/continents/africaQuestions";

// Import all country-specific question sets
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

// Create specialized question sets for countries that don't have specific questions yet
const generateCountrySpecificQuestions = (countryId: string): Question[] => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return [];
  
  // Generate country-specific questions using the utility function
  const countrySpecificQuestions = generateGenericCountryQuestions(country);
  
  // Get global questions related to the country's categories
  const categoryQuestions = globalQuestions
    .filter(q => country.categories.includes(q.category))
    .slice(0, Math.min(5, country.categories.length));
  
  // Mix both types of questions
  return [...countrySpecificQuestions, ...categoryQuestions];
};

// Create a comprehensive mapping of all country questions
// This ensures every country in the world has at least some basic questions
const buildAllCountryQuestions = (): Record<string, Question[]> => {
  // Start with existing predefined question sets
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
  };
  
  // Add specifically filtered global questions for some important countries
  const globalQuestionSets: Record<string, Question[]> = {
    "new-zealand": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Wildlife" || q.category === "History"
    ).slice(0, 10),
    "canada": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "History" || q.category === "Wildlife"
    ).slice(0, 10),
    "russia": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Geography" || q.category === "Politics"
    ).slice(0, 10),
    "argentina": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "Sports"
    ).slice(0, 10),
    "spain": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Culture" || q.category === "Art"
    ).slice(0, 10),
    "thailand": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "Religion"
    ).slice(0, 10),
    "nigeria": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "History" || q.category === "Culture"
    ).slice(0, 10),
    "united-kingdom": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Culture" || q.category === "Literature"
    ).slice(0, 10),
    "morocco": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "History"
    ).slice(0, 10),
    "ghana": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "History" || q.category === "Culture"
    ).slice(0, 10),
    "sweden": globalQuestions.filter(q => 
      q.category === "Geography" || q.category === "Culture" || q.category === "History"
    ).slice(0, 10),
    "greece": globalQuestions.filter(q => 
      q.category === "History" || q.category === "Art" || q.category === "Philosophy"
    ).slice(0, 10),
  };
  
  // Merge the predefined sets with filtered sets
  Object.entries(globalQuestionSets).forEach(([countryId, questions]) => {
    questionSets[countryId] = questions;
  });
  
  // Generate questions for ALL countries that don't have specific question sets
  countries.forEach(country => {
    if (!questionSets[country.id]) {
      questionSets[country.id] = generateCountrySpecificQuestions(country.id);
    }
  });
  
  return questionSets;
};

// Build the complete country question set
export const countryQuestions = buildAllCountryQuestions();

// Define continent questions
export const continentQuestions: Record<string, Question[]> = {
  "africa": africaQuestions,
  // Add more continent questions as they're created
};
