
import { Country, Question } from "@/types/quiz";

export interface QuizManagerState {
  selectedCountry: Country | null;
  showQuiz: boolean;
  quizResult: any;
  quizQuestions: Question[];
  isGeneratingQuestions: boolean;
}

export interface QuizManagerActions {
  handleCountryClick: (country: Country) => void;
  handleStartQuiz: (country?: Country) => Promise<void>;
  handleQuizComplete: (result: any) => void;
  handleBackToGlobe: () => void;
  handleRetryQuiz: () => void;
}
