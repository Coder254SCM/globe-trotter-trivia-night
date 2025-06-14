
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuizResult } from "@/types/quiz";
import QuizResultComponent from "@/components/QuizResult";

export default function QuizResultsPage() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [countryName, setCountryName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get stored data
    const storedResult = sessionStorage.getItem('quizResult');
    const storedCountry = sessionStorage.getItem('selectedCountry');
    
    if (!storedResult || !storedCountry) {
      navigate('/');
      return;
    }

    const result = JSON.parse(storedResult);
    const country = JSON.parse(storedCountry);
    
    setQuizResult(result);
    setCountryName(country.name);
  }, [navigate]);

  const handleRestart = () => {
    // Go back to quiz settings for the same country
    navigate('/quiz-settings');
  };

  const handleBackToGlobe = () => {
    // Clear all stored data and go back to home
    sessionStorage.removeItem('selectedCountry');
    sessionStorage.removeItem('questionCount');
    sessionStorage.removeItem('quizResult');
    navigate('/');
  };

  if (!quizResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Results...</h2>
        </div>
      </div>
    );
  }

  return (
    <QuizResultComponent
      result={quizResult}
      countryName={countryName}
      onRestart={handleRestart}
      onBackToGlobe={handleBackToGlobe}
    />
  );
}
