
import { Country, Question } from "../types/quiz";

/**
 * Creates a base set of generic questions for any country
 * @param country The country object
 * @returns An array of generic questions about the country
 */
export const generateGenericCountryQuestions = (country: Country): Question[] => {
  const continents = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"];
  const questions: Question[] = [];
  
  // Question 1: Capital City
  questions.push({
    id: `${country.id}-capital`,
    type: "multiple-choice",
    text: `What is the capital city of ${country.name}?`,
    choices: generateFakeCapitalChoices(country.name),
    category: "Geography",
    explanation: `The capital city of ${country.name} is one of the most important cities in the country.`,
    difficulty: "medium",
    lastUpdated: new Date().toISOString()
  });

  // Question 2: Continent
  questions.push({
    id: `${country.id}-continent`,
    type: "multiple-choice",
    text: `On which continent is ${country.name} located?`,
    choices: [
      { 
        id: "a", 
        text: country.continent,
        isCorrect: true 
      },
      ...continents
        .filter(c => c !== country.continent)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((text, index) => ({
          id: String.fromCharCode(98 + index),
          text,
          isCorrect: false
        }))
    ],
    category: "Geography",
    explanation: `${country.name} is located on the continent of ${country.continent}.`,
    difficulty: "easy",
    lastUpdated: new Date().toISOString()
  });

  // Question 3: Flag
  if (country.flagImageUrl) {
    questions.push({
      id: `${country.id}-flag`,
      type: "image",
      text: `Which country does this flag belong to?`,
      imageUrl: country.flagImageUrl,
      choices: [
        { id: "a", text: country.name, isCorrect: true },
        { id: "b", text: generateRandomCountryName(country.name, country.continent), isCorrect: false },
        { id: "c", text: generateRandomCountryName(country.name, country.continent), isCorrect: false },
        { id: "d", text: generateRandomCountryName(country.name, country.continent), isCorrect: false }
      ],
      category: "Geography",
      explanation: `This is the flag of ${country.name}.`,
      difficulty: "medium",
      lastUpdated: new Date().toISOString()
    });
  }

  // Question 4: Cultural question
  if (country.categories.includes("Culture")) {
    questions.push({
      id: `${country.id}-culture`,
      type: "multiple-choice",
      text: `Which of the following is ${country.name} known for?`,
      choices: generateCulturalChoices(country),
      category: "Culture",
      explanation: `${country.name} has a rich and diverse cultural heritage.`,
      difficulty: "medium",
      lastUpdated: new Date().toISOString()
    });
  }
  
  return questions;
};

/**
 * Generate fake capital choices for a country
 */
function generateFakeCapitalChoices(countryName: string): { id: string, text: string, isCorrect: boolean }[] {
  // This is a very simplified implementation - in a real app, we would use actual capital data
  const capitals = {
    "United States": "Washington D.C.",
    "United Kingdom": "London",
    "France": "Paris",
    "Germany": "Berlin",
    "Italy": "Rome",
    "Spain": "Madrid",
    "Japan": "Tokyo",
    "China": "Beijing",
    "India": "New Delhi",
    "Brazil": "Brasília",
    "Mexico": "Mexico City",
    "Canada": "Ottawa",
    "Australia": "Canberra",
    "New Zealand": "Wellington",
    "Russia": "Moscow",
    "South Africa": "Pretoria",
    "Egypt": "Cairo",
    "Kenya": "Nairobi",
    "Nigeria": "Abuja",
    "Thailand": "Bangkok",
    "Vietnam": "Hanoi",
    "Argentina": "Buenos Aires",
    "Indonesia": "Jakarta",
    "Malaysia": "Kuala Lumpur",
    "Colombia": "Bogotá"
  };
  
  // If we don't have the country in our list, create a fake capital
  if (!capitals[countryName as keyof typeof capitals]) {
    capitals[countryName as keyof typeof capitals] = `${countryName} City`;
  }
  
  const correctCapital = capitals[countryName as keyof typeof capitals];
  
  // Get other random capitals from our list
  const otherCapitals = Object.values(capitals)
    .filter(capital => capital !== correctCapital)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return [
    { id: "a", text: correctCapital, isCorrect: true },
    { id: "b", text: otherCapitals[0] || "Stockholm", isCorrect: false },
    { id: "c", text: otherCapitals[1] || "Athens", isCorrect: false },
    { id: "d", text: otherCapitals[2] || "Vienna", isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}

/**
 * Generate a random country name that's not the given country
 */
function generateRandomCountryName(countryToAvoid: string, continent: string): string {
  const countriesByContinent = {
    "Africa": ["Kenya", "South Africa", "Egypt", "Nigeria", "Morocco", "Ethiopia"],
    "Europe": ["France", "Germany", "Italy", "Spain", "United Kingdom", "Greece"],
    "Asia": ["Japan", "China", "India", "Thailand", "Vietnam", "South Korea"],
    "North America": ["United States", "Canada", "Mexico", "Cuba", "Panama"],
    "South America": ["Brazil", "Argentina", "Colombia", "Peru", "Chile"],
    "Oceania": ["Australia", "New Zealand", "Fiji", "Papua New Guinea"],
    "Antarctica": ["French Southern Territories", "Heard Island", "South Georgia"]
  };
  
  const continentCountries = countriesByContinent[continent as keyof typeof countriesByContinent] || 
                            ["France", "Germany", "United States", "Brazil"];
  
  const availableCountries = continentCountries.filter(c => c !== countryToAvoid);
  
  if (availableCountries.length > 0) {
    return availableCountries[Math.floor(Math.random() * availableCountries.length)];
  }
  
  return "Portugal"; // Fallback
}

/**
 * Generate cultural choices for a country
 */
function generateCulturalChoices(country: Country): { id: string, text: string, isCorrect: boolean }[] {
  // Cultural traits by continent (very simplified)
  const culturalTraitsByContinent = {
    "Africa": ["Traditional tribal masks", "Colorful wax print fabrics", "Drum-based music"],
    "Europe": ["Classical music", "Renaissance art", "Gothic architecture"],
    "Asia": ["Calligraphy", "Buddhist temples", "Martial arts"],
    "North America": ["Jazz music", "Hollywood films", "Fast food"],
    "South America": ["Carnival celebrations", "Soccer culture", "Salsa dancing"],
    "Oceania": ["Aboriginal art", "Polynesian tattoos", "Islander ceremonies"],
    "Antarctica": ["Scientific research stations", "Penguin conservation", "Extreme weather adaptation"]
  };
  
  const continentTraits = culturalTraitsByContinent[country.continent as keyof typeof culturalTraitsByContinent] || 
                          ["Traditional cuisine", "Folk music", "Cultural festivals"];
  
  // Pick one trait that would be correct for this country
  const correctTrait = continentTraits[0];
  
  // Get incorrect traits from other continents
  const incorrectTraits = Object.entries(culturalTraitsByContinent)
    .filter(([continent]) => continent !== country.continent)
    .map(([_, traits]) => traits[0])
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return [
    { id: "a", text: correctTrait, isCorrect: true },
    { id: "b", text: incorrectTraits[0] || "Alpine skiing", isCorrect: false },
    { id: "c", text: incorrectTraits[1] || "Bollywood cinema", isCorrect: false },
    { id: "d", text: incorrectTraits[2] || "Mariachi music", isCorrect: false }
  ].sort(() => Math.random() - 0.5);
}
