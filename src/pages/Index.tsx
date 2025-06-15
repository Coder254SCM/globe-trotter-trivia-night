
import { useState } from "react";
import Globe from "@/components/Globe";
import Quiz from "@/components/Quiz";
import QuizResult from "@/components/QuizResult";
import { QuizSettings } from "@/components/quiz/QuizSettings";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { useQuizManager } from "@/hooks/useQuizManager";
import { useNavigate } from "react-router-dom";
import { Country } from "@/types/quiz";

export default function Index() {
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

  const handleWeeklyChallengeStart = (questions: any[], challengeId: string) => {
    console.log('🔄 Starting weekly challenge:', challengeId);
    setWeeklyChallenge({ questions, challengeId });
  };

  const handleWeeklyChallengeBack = () => {
    console.log('🔄 Going back from weekly challenge');
    setWeeklyChallenge(null);
  };

  // Navigate to weekly challenges page
  const handleStartWeeklyChallenge = () => {
    console.log('🔄 Navigating to weekly challenges');
    navigate('/weekly-challenges');
  };

  // Handle country selection from Globe - redirect to quiz page
  const handleCountrySelectFromGlobe = (country: Country) => {
    console.log('🎯 Index: Country selected from Globe:', country.name, 'difficulty:', country.difficulty);
    
    // Store the selected country in sessionStorage for the quiz page
    sessionStorage.setItem('selectedCountry', JSON.stringify(country));
    
    // Navigate to quiz settings page
    navigate('/quiz-settings');
  };

  console.log('🔄 Index component rendering, state:', {
    weeklyChallenge: !!weeklyChallenge,
    showSettings,
    showQuiz,
    quizResult: !!quizResult,
    selectedCountry: selectedCountry?.name
  });

  if (weeklyChallenge) {
    console.log('🔄 Rendering weekly challenge quiz');
    return (
      <Quiz
        country={null}
        questions={weeklyChallenge.questions}
        onFinish={handleQuizComplete}
        onBack={handleWeeklyChallengeBack}
        isWeeklyChallenge={true}
        challengeId={weeklyChallenge.challengeId}
      />
    );
  }

  if (showSettings && selectedCountry) {
    console.log('🔄 Rendering quiz settings');
    return (
      <QuizSettings
        countryName={selectedCountry.name}
        countryId={selectedCountry.id}
        onStartQuiz={handleStartQuizWithCount}
        onBack={handleBackToGlobe}
      />
    );
  }

  if (showQuiz && selectedCountry && quizQuestions.length > 0) {
    console.log('🔄 Rendering quiz');
    return (
      <Quiz
        country={selectedCountry}
        questions={quizQuestions}
        onFinish={handleQuizComplete}
        onBack={handleBackToGlobe}
      />
    );
  }

  if (quizResult) {
    console.log('🔄 Rendering quiz result');
    return (
      <QuizResult
        result={quizResult}
        countryName={selectedCountry?.name || "Weekly Challenge"}
        onRestart={handleRetryQuiz}
        onBackToGlobe={handleBackToGlobe}
      />
    );
  }

  console.log('🔄 Rendering main globe view');
  return (
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
  );
}
