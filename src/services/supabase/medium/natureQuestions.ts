
import { ServiceCountry, QuestionData } from "./types";
import { QuestionHelpers } from "./questionHelpers";

export class NatureQuestions {
  static generate(country: ServiceCountry, index: number): QuestionData {
    const questions = [
      {
        text: `What type of natural landscape is most common in ${country.name}?`,
        correct: QuestionHelpers.getLandscapeType(country),
        optionB: 'Mountains',
        optionC: 'Desert',
        optionD: 'Coastal plains',
        explanation: `${country.name}'s geography features diverse natural landscapes.`
      },
      {
        text: `Which natural resource is important to ${country.name}?`,
        correct: QuestionHelpers.getNaturalResource(country),
        optionB: 'Oil',
        optionC: 'Gold',
        optionD: 'Diamonds',
        explanation: `Natural resources play a significant role in ${country.name}'s economy.`
      }
    ];
    return questions[index % questions.length];
  }
}
