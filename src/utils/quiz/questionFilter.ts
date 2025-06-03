
import { Question } from "../../types/quiz";
import countries from "../../data/countries";

// Enhanced question filtering to ensure relevance
export const filterQuestionsForCountry = (questions: Question[], countryId: string): Question[] => {
  const country = countries.find(c => c.id === countryId);
  if (!country) return questions;

  return questions.filter(question => {
    const countryName = country.name.toLowerCase();
    const continent = country.continent?.toLowerCase();
    const questionText = question.text.toLowerCase();
    const questionExplanation = question.explanation?.toLowerCase() || "";
    
    // Direct country mentions are always relevant
    if (questionText.includes(countryName) || questionExplanation.includes(countryName)) {
      return true;
    }
    
    // Check for continent relevance
    if (continent && (questionText.includes(continent) || questionExplanation.includes(continent))) {
      return true;
    }
    
    // Filter out questions about other specific regions/countries
    const otherRegions = [
      "europe", "asia", "africa", "antarctica", "oceania", "north america", "south america",
      "european", "asian", "african", "american", "australian"
    ];
    
    // If question mentions other regions but not this country's region, it's likely irrelevant
    for (const region of otherRegions) {
      if (questionText.includes(region) && region !== continent) {
        // Check if it's a general question or specifically about that other region
        if (!questionText.includes("world") && !questionText.includes("global")) {
          console.warn(`Filtered irrelevant question for ${countryName}: ${question.text.substring(0, 50)}...`);
          return false;
        }
      }
    }
    
    // Allow general knowledge questions
    if (questionText.includes("world") || questionText.includes("global") || questionText.includes("international")) {
      return true;
    }
    
    return true;
  });
};
