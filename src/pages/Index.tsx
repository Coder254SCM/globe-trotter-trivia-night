
import { useState } from "react";
import Globe from "../components/Globe";
import Quiz from "../components/Quiz";
import QuizResult from "../components/QuizResult";
import { Country, QuizResult as QuizResultType } from "../types/quiz";
import kenyaQuestions from "../data/kenyaQuestions";
import usaQuestions from "../data/usaQuestions";
import globalQuestions from "../data/globalQuestions";

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

  const getQuestions = () => {
    // Mix global questions with country-specific questions
    const countryQuestions = {
      kenya: kenyaQuestions,
      usa: usaQuestions,
      // Add more country questions here as they're created
    }[selectedCountry?.id || ''] || [];

    // Combine country-specific questions with global questions and shuffle
    const allQuestions = [...countryQuestions, ...globalQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // Take 10 random questions

    return allQuestions;
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
