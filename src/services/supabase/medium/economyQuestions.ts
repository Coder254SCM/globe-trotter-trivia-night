
import { ServiceCountry, QuestionData } from "./types";
import { QuestionHelpers } from "./questionHelpers";

export class EconomyQuestions {
  static generate(country: ServiceCountry, index: number): QuestionData {
    const questions = [
      {
        text: `What is the official currency of ${country.name}?`,
        correct: QuestionHelpers.getCurrency(country),
        optionB: 'US Dollar',
        optionC: 'Euro',
        optionD: 'British Pound',
        explanation: `${country.name} uses its national currency for domestic transactions.`
      },
      {
        text: `Which sector is most important to ${country.name}'s economy?`,
        correct: QuestionHelpers.getMainEconomicSector(country),
        optionB: 'Manufacturing',
        optionC: 'Technology',
        optionD: 'Tourism',
        explanation: `${country.name}'s economy is driven by its primary economic sectors.`
      }
    ];
    return questions[index % questions.length];
  }
}
