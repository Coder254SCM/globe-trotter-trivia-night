
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
  } = useQuizState();

  // Quiz actions
  const {
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz,
    handleShowSettings,
    handleStartQuizWithCount
  } = useQuizActions({
    selectedCountry,
    questionCount,
    setSelectedCountry,
    setShowQuiz,
    setShowSettings,
    setQuizResult,
    setQuizQuestions,
    setQuestionCount
  });

  return {
    allCountries,
    selectedCountry,
    showQuiz,
    showSettings,
    quizResult,
    quizQuestions,
    isGeneratingQuestions,
    questionCount,
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz,
    handleShowSettings,
    handleStartQuizWithCount
  };
};
