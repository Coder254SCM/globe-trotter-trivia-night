
import { Country } from "../supabase/country/countryTypes";
import { CAPITAL_ALTERNATIVES, CONTINENT_ALTERNATIVES, getUniqueOptions } from "./templateData";

export function generateGeographyQuestion(country: Country, difficulty: string, seed: number) {
  const questionTypes = [];

  // Capital question - only if country has a capital
  if (country.capital && country.capital.length > 2) {
    questionTypes.push(() => ({
      text: `What is the capital city of ${country.name}?`,
      correct: country.capital,
      options: getUniqueOptions(country.capital, CAPITAL_ALTERNATIVES),
      explanation: `${country.capital} is the capital city of ${country.name}.`
    }));
  }

  // Continent question
  if (country.continent && country.continent.length > 3) {
    questionTypes.push(() => ({
      text: `On which continent is ${country.name} located?`,
      correct: country.continent,
      options: getUniqueOptions(country.continent, CONTINENT_ALTERNATIVES),
      explanation: `${country.name} is located on the continent of ${country.continent}.`
    }));
  }

  // Population question for medium/hard
  if ((difficulty === 'medium' || difficulty === 'hard') && country.population && country.population > 1000000) {
    const populationMillion = Math.round(country.population / 1000000);
    questionTypes.push(() => ({
      text: `What is the approximate population of ${country.name}?`,
      correct: `${populationMillion} million people`,
      options: [
        `${populationMillion} million people`,
        `${Math.round(populationMillion * 1.5)} million people`,
        `${Math.round(populationMillion * 0.7)} million people`,
        `${Math.round(populationMillion * 2)} million people`
      ],
      explanation: `${country.name} has approximately ${populationMillion} million people.`
    }));
  }

  // Area question for hard difficulty
  if (difficulty === 'hard' && country.area_km2 && country.area_km2 > 1000) {
    const areaThousands = Math.round(country.area_km2 / 1000);
    questionTypes.push(() => ({
      text: `What is the approximate land area of ${country.name}?`,
      correct: `${areaThousands},000 square kilometers`,
      options: [
        `${areaThousands},000 square kilometers`,
        `${Math.round(areaThousands * 1.3)},000 square kilometers`,
        `${Math.round(areaThousands * 0.8)},000 square kilometers`,
        `${Math.round(areaThousands * 1.6)},000 square kilometers`
      ],
      explanation: `${country.name} covers approximately ${areaThousands},000 square kilometers.`
    }));
  }

  if (questionTypes.length === 0) return null;

  const selectedType = questionTypes[seed % questionTypes.length];
  return selectedType();
}
