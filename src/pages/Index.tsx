
import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useNavigate } from "react-router-dom";
import { Country } from "@/types/quiz";

// Lazy load components to prevent circular dependencies
const Globe = React.lazy(() => import("@/components/Globe"));
const Quiz = React.lazy(() => import("@/components/Quiz"));
const QuizResult = React.lazy(() => import("@/components/QuizResult"));
const QuizSettings = React.lazy(() => import("@/components/quiz/QuizSettings"));
const MainLayout = React.lazy(() => import("@/components/layout/MainLayout"));
const AppHeader = React.lazy(() => import("@/components/layout/AppHeader"));

// Import React after lazy imports to prevent issues
import React, { Suspense } from "react";

// Import hooks separately to avoid circular deps
let useQuizManager: any;
try {
  useQuizManager = require("@/hooks/useQuizManager").useQuizManager;
} catch (error) {
  console.error('❌ Failed to import useQuizManager:', error);
  useQuizManager = () => ({
    allCountries: [],
    selectedCountry: null,
    showQuiz: false,
    showSettings: false,
    quizResult: null,
    quizQuestions: [],
    isGeneratingQuestions: false,
    questionCount: 10,
    handleCountryClick: () => {},
    handleQuizComplete: () => {},
    handleBackToGlobe: () => {},
    handleRetryQuiz: () => {},
    handleStartQuizWithCount: () => {}
  });
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function IndexContent() {
  console.log('🔄 Index component loading...');
  
  const [weeklyChallenge, setWeeklyChallenge] = useState<{questions: any[], challengeId: string} | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  console.log('🔄 Initializing useQuizManager...');
  
  let quizManagerResult;
  try {
    quizManagerResult = useQuizManager();
  } catch (error) {
    console.error('❌ useQuizManager failed:', error);
    setInitError('Failed to initialize quiz manager');
    quizManagerResult = {
      allCountries: [],
      selectedCountry: null,
      showQuiz: false,
      showSettings: false,
      quizResult: null,
      quizQuestions: [],
      isGeneratingQuestions: false,
      questionCount: 10,
      handleCountryClick: () => {},
      handleQuizComplete: () => {},
      handleBackToGlobe: () => {},
      handleRetryQuiz: () => {},
      handleStartQuizWithCount: () => {}
    };
  }

  const {
    allCountries,
    selectedCountry,
    showQuiz,
    showSettings,
    quizResult,
    quizQuestions,
    isGeneratingQuestions,
    handleCountryClick,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz,
    handleStartQuizWithCount
  } = quizManagerResult;

  console.log('🔄 useQuizManager initialized, countries count:', allCountries?.length || 0);

  useEffect(() => {
    console.log('🔄 Index component mounted successfully');
    
    // Test that all required components are available
    const requiredComponents = ['Globe', 'Quiz', 'QuizResult', 'MainLayout', 'AppHeader'];
    requiredComponents.forEach(comp => {
      console.log(`📦 ${comp} component available:`, !!eval(comp));
    });
  }, []);

  const handleWeeklyChallengeStart = (questions: any[], challengeId: string) => {
    console.log('🔄 Starting weekly challenge:', challengeId);
    setWeeklyChallenge({ questions, challengeId });
  };

  const handleWeeklyChallengeBack = () => {
    console.log('🔄 Going back from weekly challenge');
    setWeeklyChallenge(null);
  };

  const handleStartWeeklyChallenge = () => {
    console.log('🔄 Navigating to weekly challenges');
    navigate('/weekly-challenges');
  };

  const handleCountrySelectFromGlobe = (country: Country) => {
    console.log('🎯 Index: Country selected from Globe:', country.name, 'difficulty:', country.difficulty);
    sessionStorage.setItem('selectedCountry', JSON.stringify(country));
    navigate('/quiz-settings');
  };

  console.log('🔄 Index component rendering, state:', {
    weeklyChallenge: !!weeklyChallenge,
    showSettings,
    showQuiz,
    quizResult: !!quizResult,
    selectedCountry: selectedCountry?.name,
    initError
  });

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Initialization Error</h1>
          <p className="text-muted-foreground">{initError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (weeklyChallenge) {
    console.log('🔄 Rendering weekly challenge quiz');
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Quiz
          country={null}
          questions={weeklyChallenge.questions}
          onFinish={handleQuizComplete}
          onBack={handleWeeklyChallengeBack}
          isWeeklyChallenge={true}
          challengeId={weeklyChallenge.challengeId}
        />
      </Suspense>
    );
  }

  if (showSettings && selectedCountry) {
    console.log('🔄 Rendering quiz settings');
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <QuizSettings
          countryName={selectedCountry.name}
          countryId={selectedCountry.id}
          onStartQuiz={handleStartQuizWithCount}
          onBack={handleBackToGlobe}
        />
      </Suspense>
    );
  }

  if (showQuiz && selectedCountry && quizQuestions.length > 0) {
    console.log('🔄 Rendering quiz');
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Quiz
          country={selectedCountry}
          questions={quizQuestions}
          onFinish={handleQuizComplete}
          onBack={handleBackToGlobe}
        />
      </Suspense>
    );
  }

  if (quizResult) {
    console.log('🔄 Rendering quiz result');
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <QuizResult
          result={quizResult}
          countryName={selectedCountry?.name || "Weekly Challenge"}
          onRestart={handleRetryQuiz}
          onBackToGlobe={handleBackToGlobe}
        />
      </Suspense>
    );
  }

  console.log('🔄 Rendering main globe view');
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainLayout>
        <AppHeader 
          countriesCount={allCountries?.length || 0} 
          isGeneratingQuestions={isGeneratingQuestions}
        />
        
        <Globe
          onCountrySelect={handleCountrySelectFromGlobe}
          onStartWeeklyChallenge={handleStartWeeklyChallenge}
        />
      </MainLayout>
    </Suspense>
  );
}

export default function Index() {
  return (
    <ErrorBoundary>
      <IndexContent />
    </ErrorBoundary>
  );
}
