
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
  const [weeklyChallenge, setWeeklyChallenge] = useState<{questions: any[], challengeId: string} | null>(null);
  const navigate = useNavigate();
  
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

  const handleWeeklyChallengeStart = (questions: any[], challengeId: string) => {
    setWeeklyChallenge({ questions, challengeId });
  };

  const handleWeeklyChallengeBack = () => {
    setWeeklyChallenge(null);
  };

  // Navigate to weekly challenges page
  const handleStartWeeklyChallenge = () => {
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

  if (weeklyChallenge) {
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
    return (
      <QuizResult
        result={quizResult}
        countryName={selectedCountry?.name || "Weekly Challenge"}
        onRestart={handleRetryQuiz}
        onBackToGlobe={handleBackToGlobe}
      />
    );
  }

  return (
    <MainLayout>
      <AppHeader 
        countriesCount={allCountries.length} 
        isGeneratingQuestions={isGeneratingQuestions}
      />
      
      <Globe
        onCountrySelect={handleCountrySelectFromGlobe}
        onStartWeeklyChallenge={handleStartWeeklyChallenge}
      />
    </MainLayout>
  );
}
