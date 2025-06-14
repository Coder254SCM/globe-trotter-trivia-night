
import { useState } from "react";
import Globe from "@/components/Globe";
import Quiz from "@/components/Quiz";
import QuizResult from "@/components/QuizResult";
import { QuizSettings } from "@/components/quiz/QuizSettings";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { useQuizManager } from "@/hooks/useQuizManager";

export default function Index() {
  const [weeklyChallenge, setWeeklyChallenge] = useState<{questions: any[], challengeId: string} | null>(null);
  
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

  // Simple handler for Globe component that doesn't expect parameters
  const handleStartWeeklyChallenge = () => {
    // This will be handled by the WeeklyChallenges component instead
    console.log('Weekly challenge requested from globe');
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
        onCountrySelect={handleCountryClick}
        onStartWeeklyChallenge={handleStartWeeklyChallenge}
      />
    </MainLayout>
  );
}
