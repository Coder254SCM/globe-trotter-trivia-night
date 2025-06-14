
import { useDatabaseInit } from "./quiz/useDatabaseInit";
import { useQuizState } from "./quiz/useQuizState";
import { useQuizActions } from "./quiz/useQuizActions";
import { useEnhancedCountries } from "./useEnhancedCountries";

export const useQuizManager = () => {
  // Initialize database and AI questions
  useDatabaseInit();

  // Use enhanced countries with 12+ categories each
  const allCountries = useEnhancedCountries();

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
