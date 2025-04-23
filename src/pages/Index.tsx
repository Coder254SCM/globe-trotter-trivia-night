
import { useState } from "react";
import Globe from "../components/Globe";
import Quiz from "../components/Quiz";
import QuizResult from "../components/QuizResult";
import { Country, QuizResult as QuizResultType } from "../types/quiz";
import kenyaQuestions from "../data/kenyaQuestions";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResultType | null>(null);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setQuizResult(null);
  };

  const handleQuizFinish = (result: QuizResultType) => {
    setQuizResult(result);
  };

  const handleBackToGlobe = () => {
    setSelectedCountry(null);
    setQuizResult(null);
  };

  const handleRestartQuiz = () => {
    setQuizResult(null);
  };

  // For now, we only have Kenya questions
  const getQuestions = () => {
    if (selectedCountry?.id === "kenya") {
      return kenyaQuestions;
    }
    // For other countries, use Kenya questions as a placeholder
    return kenyaQuestions;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!selectedCountry && (
        <Globe onCountrySelect={handleCountrySelect} />
      )}

      {selectedCountry && !quizResult && (
        <Quiz 
          country={selectedCountry}
          questions={getQuestions()}
          onFinish={handleQuizFinish}
          onBack={handleBackToGlobe}
        />
      )}

      {selectedCountry && quizResult && (
        <QuizResult 
          result={quizResult}
          countryName={selectedCountry.name}
          onRestart={handleRestartQuiz}
          onBackToGlobe={handleBackToGlobe}
        />
      )}
    </div>
  );
};

export default Index;
