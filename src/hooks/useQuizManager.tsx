
import { useDatabaseInit } from "./quiz/useDatabaseInit";
import { useQuizState } from "./quiz/useQuizState";
import { useQuizActions } from "./quiz/useQuizActions";
import { useEnhancedCountries } from "./useEnhancedCountries";
import { useEffect } from "react";
import { DatabaseInitializationService } from "@/services/database/initializationService";

export const useQuizManager = () => {
  console.log('🔧 useQuizManager: Starting initialization...');
  
  // Initialize database and AI questions
  console.log('🔧 useQuizManager: Initializing database...');
  useDatabaseInit();

  // Auto-initialization effect
  useEffect(() => {
    const autoInit = async () => {
      try {
        const sessionKey = 'quiz_auto_init_attempted';
        if (!sessionStorage.getItem(sessionKey)) {
          console.log('🚀 Attempting auto-initialization...');
          sessionStorage.setItem(sessionKey, 'true');
          
          // Initialize database with all countries
          await DatabaseInitializationService.initializeDatabase();
          console.log('✅ Auto-initialization complete');
        }
      } catch (error) {
        console.warn('⚠️ Auto-initialization failed, will generate on-demand:', error);
      }
    };

    // Run after a short delay to not block initial render
    setTimeout(autoInit, 2000);
  }, []);

  // Use enhanced countries with 12+ categories each
  console.log('🔧 useQuizManager: Loading enhanced countries...');
  const allCountries = useEnhancedCountries();
  console.log('🔧 useQuizManager: Enhanced countries loaded:', allCountries?.length || 0);

  // Quiz state management
  console.log('🔧 useQuizManager: Initializing quiz state...');
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
  console.log('🔧 useQuizManager: Initializing quiz actions...');
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

  console.log('🔧 useQuizManager: Initialization complete');

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
