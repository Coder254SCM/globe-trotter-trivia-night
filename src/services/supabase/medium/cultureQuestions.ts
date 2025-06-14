
import { ServiceCountry, QuestionData } from "./types";
import { QuestionHelpers } from "./questionHelpers";

export class CultureQuestions {
  static generate(country: ServiceCountry, index: number): QuestionData {
    const questions = [
      {
        text: `What is the most widely spoken official language in ${country.name}?`,
        correct: QuestionHelpers.getOfficialLanguage(country),
        optionB: 'English',
        optionC: 'French',
        optionD: 'Spanish',
        explanation: `The official language reflects ${country.name}'s cultural and historical background.`
      },
      {
        text: `What is a traditional dish commonly eaten in ${country.name}?`,
        correct: QuestionHelpers.getTraditionalDish(country),
        optionB: 'Pizza',
        optionC: 'Sushi',
        optionD: 'Tacos',
        explanation: `Traditional cuisine in ${country.name} reflects local ingredients and cultural influences.`
      }
    ];
    return questions[index % questions.length];
  }
}
