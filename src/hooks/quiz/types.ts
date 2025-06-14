
import { Country, Question } from "@/types/quiz";

export interface QuizManagerState {
  selectedCountry: Country | null;
  showQuiz: boolean;
  showSettings: boolean;
  quizResult: any;
  quizQuestions: Question[];
  isGeneratingQuestions: boolean;
  questionCount: number;
}

export interface QuizManagerActions {
  handleCountryClick: (country: Country) => void;
  handleStartQuiz: (country?: Country, questionCount?: number) => Promise<void>;
  handleQuizComplete: (result: any) => void;
  handleBackToGlobe: () => void;
  handleRetryQuiz: () => void;
  handleShowSettings: () => void;
  handleStartQuizWithCount: (questionCount: number) => void;
}
