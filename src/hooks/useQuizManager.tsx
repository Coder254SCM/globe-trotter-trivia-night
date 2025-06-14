
import countries from "@/data/countries";
import { useDatabaseInit } from "./quiz/useDatabaseInit";
import { useQuizState } from "./quiz/useQuizState";
import { useQuizActions } from "./quiz/useQuizActions";

export const useQuizManager = () => {
  // Initialize database and AI questions
  useDatabaseInit();

  // Use the static countries data directly - all 195 countries
  const allCountries = countries;

  // Quiz state management
  const {
    selectedCountry,
    showQuiz,
    quizResult,
    quizQuestions,
    isGeneratingQuestions,
    setSelectedCountry,
    setShowQuiz,
    setQuizResult,
    setQuizQuestions,
    setIsGeneratingQuestions
  } = useQuizState();

  // Quiz actions
  const {
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz
  } = useQuizActions({
    selectedCountry,
    setSelectedCountry,
    setShowQuiz,
    setQuizResult,
    setQuizQuestions
  });

  return {
    allCountries,
    selectedCountry,
    showQuiz,
    quizResult,
    quizQuestions,
    isGeneratingQuestions,
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz
  };
};
