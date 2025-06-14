
import { ServiceCountry, QuestionData } from "./types";
import { QuestionHelpers } from "./questionHelpers";

export class HistoryQuestions {
  static generate(country: ServiceCountry, index: number): QuestionData {
    const questions = [
      {
        text: `When did ${country.name} gain its independence?`,
        correct: QuestionHelpers.getIndependenceYear(country),
        optionB: '1945',
        optionC: '1960',
        optionD: '1975',
        explanation: `${country.name} achieved independence and became a sovereign nation.`
      },
      {
        text: `Which colonial power had significant influence over ${country.name}?`,
        correct: QuestionHelpers.getColonialPower(country),
        optionB: 'Spain',
        optionC: 'Netherlands',
        optionD: 'Portugal',
        explanation: `Historical colonial influence shaped much of ${country.name}'s early development.`
      }
    ];
    return questions[index % questions.length];
  }
}
