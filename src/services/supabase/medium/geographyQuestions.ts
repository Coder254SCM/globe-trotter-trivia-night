
import { ServiceCountry, QuestionData } from "./types";
import { QuestionHelpers } from "./questionHelpers";

export class GeographyQuestions {
  static generate(country: ServiceCountry, index: number): QuestionData {
    const questions = [
      {
        text: `What is the capital city of ${country.name}?`,
        correct: country.capital || `${country.name} capital`,
        optionB: this.getAlternativeCapital(country, 1),
        optionC: this.getAlternativeCapital(country, 2),
        optionD: this.getAlternativeCapital(country, 3),
        explanation: `${country.capital || 'The capital'} is the official capital and largest city of ${country.name}.`
      },
      {
        text: `Which continent is ${country.name} located in?`,
        correct: country.continent,
        optionB: this.getAlternativeContinent(country.continent, 1),
        optionC: this.getAlternativeContinent(country.continent, 2),
        optionD: this.getAlternativeContinent(country.continent, 3),
        explanation: `${country.name} is located in ${country.continent}.`
      },
      {
        text: `What type of climate does most of ${country.name} experience?`,
        correct: QuestionHelpers.getClimateType(country),
        optionB: 'Arctic tundra climate',
        optionC: 'Desert climate',
        optionD: 'Tropical rainforest climate',
        explanation: `${country.name}'s climate is influenced by its geographic location in ${country.continent}.`
      },
      {
        text: `Which of these best describes ${country.name}'s main landscape?`,
        correct: QuestionHelpers.getLandscapeType(country),
        optionB: 'Volcanic islands',
        optionC: 'Ice sheets',
        optionD: 'Coastal marshlands',
        explanation: `${country.name}'s geography is characterized by its distinctive landscape features.`
      },
      {
        text: `What is a major natural resource found in ${country.name}?`,
        correct: QuestionHelpers.getNaturalResource(country),
        optionB: 'Uranium',
        optionC: 'Rare earth metals',
        optionD: 'Lithium',
        explanation: `Natural resources play an important role in ${country.name}'s economy.`
      }
    ];
    return questions[index % questions.length];
  }

  private static getAlternativeCapital(country: ServiceCountry, option: number): string {
    const alternatives = [
      ['London', 'Paris', 'Berlin'],
      ['Tokyo', 'Seoul', 'Beijing'],
      ['New York', 'Los Angeles', 'Chicago'],
      ['Mumbai', 'Delhi', 'Kolkata'],
      ['São Paulo', 'Rio de Janeiro', 'Brasília']
    ];
    
    const set = alternatives[Math.abs(country.name.length) % alternatives.length];
    return set[(option - 1) % set.length];
  }

  private static getAlternativeContinent(correctContinent: string, option: number): string {
    const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
    const alternatives = continents.filter(c => c !== correctContinent);
    return alternatives[(option - 1) % alternatives.length];
  }
}
