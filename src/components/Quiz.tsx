
import { useEffect } from "react";
import { QuizResult, Country, Question } from "../types/quiz";
import { useQuizController } from "@/hooks/quiz/useQuizController";
import { QuizError } from "./quiz/QuizError";
import { QuizView } from "./quiz/QuizView";

// Simple inline question validation
const isQuestionInvalid = (question: Question): boolean => {
  if (!question) return true;
  if (!question.text || question.text.length < 10) return true;
  if (!question.choices || question.choices.length !== 4) return true;
  return false;
};

interface QuizProps {
  country: Country | null;
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  onBack: () => void;
  isWeeklyChallenge?: boolean;
  challengeId?: string;
}

const Quiz = ({ country, questions, onFinish, onBack, isWeeklyChallenge = false, challengeId }: QuizProps) => {
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    scrollToTop();
    setTimeout(scrollToTop, 0);
  }, []);

  const {
    currentQuestionIndex,
    currentQuestion,
    selectedChoice,
    isAnswered,
    timeRemaining,
    setTimeRemaining,
    handleTimeUp,
    handleChoiceClick,
    handleNext,
    handleSkip,
  } = useQuizController({
    country,
    questions,
    onFinish,
    isWeeklyChallenge,
    challengeId,
  });

  if (!questions || questions.length === 0) {
    return <QuizError type="no-questions" onBack={onBack} />;
  }

  if (isQuestionInvalid(currentQuestion)) {
    console.error('❌ Invalid question structure detected:', {
      currentQuestion
    });
    return (
      <QuizError
        type="quality-issue"
        onBack={onBack}
        onSkip={handleSkip}
        isLastQuestion={currentQuestionIndex >= questions.length - 1}
      />
    );
  }

  return (
    <QuizView
      country={country}
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      currentQuestion={currentQuestion}
      isAnswered={isAnswered}
      selectedChoice={selectedChoice}
      timeRemaining={timeRemaining}
      setTimeRemaining={setTimeRemaining}
      onBack={onBack}
      onTimeUp={handleTimeUp}
      handleChoiceClick={handleChoiceClick}
      handleNext={handleNext}
      isWeeklyChallenge={isWeeklyChallenge}
    />
  );
};

export default Quiz;
