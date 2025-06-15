
import { Country } from "../supabase/country/countryTypes";
import { getCountryInfo } from "../../utils/external/restCountriesApi";

export type AdvancedTemplateInput = {
  country: Country;
  difficulty: 'easy' | 'medium' | 'hard';
  seed: number;
  extraData?: any;
};

// More advanced template set with diverse types, superlatives, negatives, and real data support
export async function generateAdvancedQuestion(
  { country, difficulty, seed, extraData }: AdvancedTemplateInput
) {
  // Fallback in case external data is not available yet
  const capital = extraData?.capital ?? country.capital ?? "the capital";
  const area = extraData?.area ?? country.area_km2 ?? "unknown size";
  const population = extraData?.population ?? country.population ?? "unknown population";
  const currencies = extraData?.currencies ?? ["the official currency"];
  const languages = extraData?.languages ?? ["the official language"];
  const neighbours = extraData?.borders ?? ["no neighboring countries"];
  const region = country.continent;

  const advancedTemplates = [
    // Standard
    {
      text: `What is the capital city of ${country.name}?`,
      correct: capital,
      options: shuffleOptions([capital, "Paris", "Cairo", "Beijing"]),
      explanation: `${capital} is the capital of ${country.name}.`
    },
    // Superlative
    {
      text: `Which of the following is the largest by area?`,
      correct: country.name,
      options: shuffleOptions([country.name, "Iceland", "Denmark", "Belgium"]),
      explanation: `${country.name} is the largest among the options provided.`
    },
    // Negative
    {
      text: `Which of these countries does NOT border ${country.name}?`,
      correct: "Australia",
      options: shuffleOptions([...(neighbours.length > 0 ? [neighbours[0]] : []), "Australia", "Canada", "Japan"]),
      explanation: `Australia does not border ${country.name}.`
    },
    // True/False
    {
      text: `${country.name} is located in ${region}. True or False?`,
      correct: "True",
      options: ["True", "False"],
      explanation: `${country.name} is in the ${region} continent.`
    },
    // Population
    {
      text: `What is the approximate population of ${country.name}?`,
      correct: population?.toLocaleString(),
      options: shuffleOptions([
        population?.toLocaleString(),
        (population + 1000000)?.toLocaleString?.() || "Unknown",
        (population - 1000000)?.toLocaleString?.() || "Unknown",
        "10,000"
      ]),
      explanation: `${country.name} has an estimated population of ${population?.toLocaleString()}.`
    },
    // Currency
    {
      text: `What is the official currency of ${country.name}?`,
      correct: currencies[0],
      options: shuffleOptions([currencies[0], "Euro", "US Dollar", "Yen"]),
      explanation: `The official currency of ${country.name} is ${currencies[0]}.`
    },
    // Language
    {
      text: `Which language is mainly spoken in ${country.name}?`,
      correct: languages[0],
      options: shuffleOptions([languages[0], "English", "Spanish", "Mandarin"]),
      explanation: `${languages[0]} is mainly spoken in ${country.name}.`
    }
    // **Add more: major river, neighboring countries, major exports, famous events, leaders, year founded, etc.**
  ];

  // Select template based on seed for variance
  const template = advancedTemplates[seed % advancedTemplates.length];

  return {
    text: template.text,
    correct: template.correct,
    options: template.options,
    explanation: template.explanation
  };
}

// Simple shuffle for variability
function shuffleOptions(options: string[]) {
  return options
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }, index) => value);
}
