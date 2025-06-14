
export interface ServiceCountry {
  id: string;
  name: string;
  continent: string;
  capital?: string;
}

export interface QuestionData {
  text: string;
  correct: string;
  optionB: string;
  optionC: string;
  optionD: string;
  explanation: string;
}
