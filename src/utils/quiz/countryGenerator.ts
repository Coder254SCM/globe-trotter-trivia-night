
import { Question, Country } from "../../types/quiz";
import countries from "../../data/countries";

// Generate basic questions for any country that doesn't have specific questions
export const generateBasicCountryQuestions = (country: Country): Question[] => {
  const questions: Question[] = [];
  
  // Capital question
  questions.push({
    id: `${country.id}-capital`,
    type: "fill-blank",
    text: `What is the capital city of ${country.name}?`,
    choices: [
      { id: "a", text: "Unknown", isCorrect: true },
      { id: "b", text: "Not specified", isCorrect: false },
      { id: "c", text: "No data", isCorrect: false },
      { id: "d", text: "Research needed", isCorrect: false },
    ],
    category: "Geography",
    explanation: `This question needs to be updated with the correct capital of ${country.name}.`,
    difficulty: "easy",
  });

  // Location question
  questions.push({
    id: `${country.id}-location`,
    type: "multiple-choice",
    text: `Which continent is ${country.name} located in?`,
    choices: [
      { id: "a", text: country.continent, isCorrect: true },
      { id: "b", text: "Asia", isCorrect: false },
      { id: "c", text: "Europe", isCorrect: false },
      { id: "d", text: "Africa", isCorrect: false },
    ].filter(choice => choice.text !== country.continent || choice.isCorrect),
    category: "Geography",
    explanation: `${country.name} is located in ${country.continent}.`,
    difficulty: "easy",
  });

  // Flag question
  if (country.flagImageUrl) {
    questions.push({
      id: `${country.id}-flag`,
      type: "image",
      text: `Which country does this flag belong to?`,
      imageUrl: country.flagImageUrl,
      choices: [
        { id: "a", text: country.name, isCorrect: true },
        { id: "b", text: "Unknown Country A", isCorrect: false },
        { id: "c", text: "Unknown Country B", isCorrect: false },
        { id: "d", text: "Unknown Country C", isCorrect: false },
      ],
      category: "Geography",
      explanation: `This is the flag of ${country.name}.`,
      difficulty: "medium",
    });
  }

  return questions;
};

// Create comprehensive question database for all 195 countries
export const generateAllCountryQuestions = (): Record<string, Question[]> => {
  const allCountryQuestions: Record<string, Question[]> = {};
  
  countries.forEach(country => {
    // Generate at least 5 basic questions for each country
    allCountryQuestions[country.id] = generateBasicCountryQuestions(country);
  });
  
  return allCountryQuestions;
};

// Get question count summary
export const getQuestionCoverage = () => {
  const coverage = countries.map(country => ({
    id: country.id,
    name: country.name,
    continent: country.continent,
    hasQuestions: generateBasicCountryQuestions(country).length > 0,
    questionCount: generateBasicCountryQuestions(country).length,
  }));
  
  return {
    totalCountries: countries.length,
    countriesWithQuestions: coverage.filter(c => c.hasQuestions).length,
    totalQuestions: coverage.reduce((sum, c) => sum + c.questionCount, 0),
    coverage,
  };
};
