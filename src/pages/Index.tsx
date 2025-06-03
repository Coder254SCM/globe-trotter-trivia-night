import { useState, useEffect } from "react";
import Globe from "../components/Globe";
import Quiz from "../components/Quiz";
import QuizResult from "../components/QuizResult";
import { Country, QuizResult as QuizResultType, Question } from "../types/quiz";
import { getQuizQuestions, recordQuizResults, getMostFailedQuestions } from "../utils/quizDataManager";
import { toast } from "@/components/ui/use-toast";
import { logProductionStatus } from "../utils/quiz/productionAudit";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResultType | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState<Question[]>([]);
  const [isWeeklyChallenge, setIsWeeklyChallenge] = useState(false);

  // Run production audit on app start
  useEffect(() => {
    const runInitialAudit = async () => {
      console.log("🔍 Running initial production audit...");
      await logProductionStatus();
    };
    
    runInitialAudit();
  }, []);

  // Check if weekly challenge needs to be updated
  useEffect(() => {
    const lastChallengeDate = localStorage.getItem('lastChallengeDate');
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (!lastChallengeDate || lastChallengeDate !== currentDate) {
      // Get most failed questions for weekly challenge
      const weeklyQuestions = getMostFailedQuestions(10);
      if (weeklyQuestions.length > 0) {
        setWeeklyChallenge(weeklyQuestions);
        localStorage.setItem('lastChallengeDate', currentDate);
      }
    }
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setQuizResult(null);
    setIsWeeklyChallenge(false);
    
    // Get appropriate questions for the selected country
    const questions = getQuizQuestions(country.id, country.continent, 10, true);
    setQuizQuestions(questions);
    
    toast({
      title: `${country.name} Quiz`,
      description: `Loading ${questions.length} questions about ${country.name} and world knowledge.`,
    });
  };

  const handleStartWeeklyChallenge = () => {
    setSelectedCountry(null);
    setQuizResult(null);
    setIsWeeklyChallenge(true);
    setQuizQuestions(weeklyChallenge.length > 0 ? weeklyChallenge : getMostFailedQuestions(10));
    
    toast({
      title: "Weekly Challenge",
      description: "Test yourself on the most challenging questions from around the world!",
    });
  };

  const handleQuizFinish = (result: QuizResultType) => {
    setQuizResult(result);
    
    // Track failed questions for future challenges
    recordQuizResults({
      ...result,
      failedQuestionIds: quizQuestions
        .filter((_, index) => !result.correctQuestions?.includes(index))
        .map(q => q.id)
    }, quizQuestions);
  };

  const handleBackToGlobe = () => {
    setSelectedCountry(null);
    setQuizResult(null);
    setIsWeeklyChallenge(false);
  };

  const handleRestartQuiz = () => {
    setQuizResult(null);
    
    // Refresh questions to get new ones
    if (selectedCountry) {
      const questions = getQuizQuestions(selectedCountry.id, selectedCountry.continent, 10, true);
      setQuizQuestions(questions);
    } else if (isWeeklyChallenge) {
      setQuizQuestions(weeklyChallenge.length > 0 ? weeklyChallenge : getMostFailedQuestions(10));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!selectedCountry && !isWeeklyChallenge && (
        <Globe 
          onCountrySelect={handleCountrySelect}
          onStartWeeklyChallenge={weeklyChallenge.length > 0 ? handleStartWeeklyChallenge : undefined}
        />
      )}

      {(selectedCountry || isWeeklyChallenge) && !quizResult && (
        <Quiz 
          country={selectedCountry}
          questions={quizQuestions}
          onFinish={handleQuizFinish}
          onBack={handleBackToGlobe}
          isWeeklyChallenge={isWeeklyChallenge}
        />
      )}

      {(selectedCountry || isWeeklyChallenge) && quizResult && (
        <QuizResult 
          result={quizResult}
          countryName={selectedCountry?.name || "Global Challenge"}
          onRestart={handleRestartQuiz}
          onBackToGlobe={handleBackToGlobe}
          isWeeklyChallenge={isWeeklyChallenge}
        />
      )}
    </div>
  );
};

export default Index;
