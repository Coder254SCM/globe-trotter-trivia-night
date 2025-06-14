
import Globe from "@/components/Globe";
import Quiz from "@/components/Quiz";
import QuizResult from "@/components/QuizResult";
import { QuizSettings } from "@/components/quiz/QuizSettings";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { useQuizManager } from "@/hooks/useQuizManager";

export default function Index() {
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

  if (showSettings && selectedCountry) {
    return (
      <QuizSettings
        countryName={selectedCountry.name}
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
        countryName={selectedCountry?.name || "Unknown"}
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
        onStartWeeklyChallenge={() => {}}
      />
    </MainLayout>
  );
}
