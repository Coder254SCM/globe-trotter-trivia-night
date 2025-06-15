
import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useNavigate } from "react-router-dom";
import { Country } from "@/types/quiz";
import React, { Suspense } from "react";

// Lazy load components with proper handling for named exports
const Globe = React.lazy(() => import("@/components/Globe"));
const Quiz = React.lazy(() => import("@/components/Quiz"));
const QuizResult = React.lazy(() => import("@/components/QuizResult"));
const QuizSettings = React.lazy(() => 
  import("@/components/quiz/QuizSettings").then(module => ({ 
    default: module.QuizSettings 
  }))
);
const MainLayout = React.lazy(() => 
  import("@/components/layout/MainLayout").then(module => ({ 
    default: module.MainLayout 
  }))
);
const AppHeader = React.lazy(() => 
  import("@/components/layout/AppHeader").then(module => ({ 
    default: module.AppHeader 
  }))
);

// Import hooks with proper error handling
import { useQuizManager } from "@/hooks/useQuizManager";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function IndexContent() {
  console.log('🔄 Index component loading...');
  
  const [weeklyChallenge, setWeeklyChallenge] = useState<{questions: any[], challengeId: string} | null>(null);
  const navigate = useNavigate();
  
  console.log('🔄 Initializing useQuizManager...');
  
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
  } = useQuizManager();

  console.log('🔄 useQuizManager initialized, countries count:', allCountries?.length || 0);

  useEffect(() => {
    console.log('🔄 Index component mounted successfully');
    console.log('🔄 Countries loaded:', allCountries?.length || 0);
  }, [allCountries]);

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
    countriesAvailable: allCountries?.length || 0
  });

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
