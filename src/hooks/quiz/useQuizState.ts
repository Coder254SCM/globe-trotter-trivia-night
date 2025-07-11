
import { useState } from "react";
import { Country, Question } from "@/types/quiz";
import { QuizManagerState } from "./types";

export const useQuizState = (): QuizManagerState & {
  setSelectedCountry: (country: Country | null) => void;
  setShowQuiz: (show: boolean) => void;
  setQuizResult: (result: any) => void;
  setQuizQuestions: (questions: Question[]) => void;
  setIsGeneratingQuestions: (generating: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setQuestionCount: (count: number) => void;
} => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(10);

  return {
    selectedCountry,
    showQuiz,
    showSettings,
    quizResult,
    quizQuestions,
    isGeneratingQuestions,
    questionCount,
    setSelectedCountry,
    setShowQuiz,
    setShowSettings,
    setQuizResult,
    setQuizQuestions,
    setIsGeneratingQuestions,
    setQuestionCount
  };
};
