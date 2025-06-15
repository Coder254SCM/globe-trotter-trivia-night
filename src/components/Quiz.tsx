
import { useEffect } from "react";
import { QuizResult, Country, Question } from "../types/quiz";
import { useQuizController } from "@/hooks/quiz/useQuizController";
import { isQuestionInvalid } from "@/utils/quiz/questionValidator";
import { QuizError } from "./quiz/QuizError";
import { QuizView } from "./quiz/QuizView";

interface QuizProps {
  country: Country | null;
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  onBack: () => void;
  isWeeklyChallenge?: boolean;
}

const Quiz = ({ country, questions, onFinish, onBack, isWeeklyChallenge = false }: QuizProps) => {
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

