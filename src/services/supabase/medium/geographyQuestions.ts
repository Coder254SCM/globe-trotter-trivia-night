
import { ServiceCountry, QuestionData } from "./types";
import { QuestionHelpers } from "./questionHelpers";

export class GeographyQuestions {
  static generate(country: ServiceCountry, index: number): QuestionData {
    const questions = [
      {
        text: `What is the capital city of ${country.name}?`,
        correct: country.capital || `Capital of ${country.name}`,
        optionB: `Second largest city in ${country.name}`,
        optionC: `Former capital of ${country.name}`,
        optionD: `Major port city in ${country.name}`,
        explanation: `The capital of ${country.name} serves as the political and administrative center.`
      },
      {
        text: `Which continent is ${country.name} located in?`,
        correct: country.continent,
        optionB: country.continent === 'Africa' ? 'Asia' : 'Africa',
        optionC: country.continent === 'Europe' ? 'North America' : 'Europe',
        optionD: country.continent === 'South America' ? 'Oceania' : 'South America',
        explanation: `${country.name} is located in ${country.continent}.`
      },
      {
        text: `What type of climate does most of ${country.name} experience?`,
        correct: QuestionHelpers.getClimateType(country),
        optionB: 'Arctic tundra',
        optionC: 'Desert',
        optionD: 'Tropical rainforest',
        explanation: `${country.name}'s climate is influenced by its geographic location in ${country.continent}.`
      }
    ];
    return questions[index % questions.length];
  }
}
