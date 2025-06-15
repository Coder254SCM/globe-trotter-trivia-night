
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Country, Question } from "@/types/quiz";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuizHeader } from "./QuizHeader";
import { QuizProgress } from "./QuizProgress";
import { QuestionCard } from "./QuestionCard";
import { ChoiceButton } from "./ChoiceButton";
import { QuizTimer } from "./QuizTimer";

interface QuizViewProps {
  country: Country | null;
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question;
  isAnswered: boolean;
  selectedChoice: string | null;
  timeRemaining: number;
  setTimeRemaining: (time: number | ((prev: number) => number)) => void;
  onBack: () => void;
  onTimeUp: () => void;
  handleChoiceClick: (choiceId: string) => void;
  handleNext: () => void;
  isWeeklyChallenge?: boolean;
}

export const QuizView = ({
  country,
  questions,
  currentQuestionIndex,
  currentQuestion,
  isAnswered,
  selectedChoice,
  timeRemaining,
  setTimeRemaining,
  onBack,
  onTimeUp,
  handleChoiceClick,
  handleNext,
  isWeeklyChallenge = false,
}: QuizViewProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed inset-0 w-full bg-background overflow-auto" style={{ paddingTop: 0, marginTop: 0 }}>
      <QuizTimer
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        difficulty={currentQuestion?.difficulty || 'medium'}
        isMobile={isMobile}
        isAnswered={isAnswered}
        onTimeUp={onTimeUp}
      />

      <QuizHeader
        onBack={onBack}
        isWeeklyChallenge={isWeeklyChallenge}
        countryName={country?.name}
        timeRemaining={timeRemaining}
        isMobile={isMobile}
      />

      <div className={`${isMobile ? 'p-2 pt-4' : 'p-4 pt-6'} flex flex-col ${isMobile ? 'gap-4' : 'gap-6'} max-w-4xl mx-auto`}>
        <QuizProgress
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          category={currentQuestion?.category || 'General'}
          isMobile={isMobile}
        />
        
        <Card className={`${isMobile ? 'p-4' : 'p-6'} border-primary/20 shadow-lg shadow-primary/20`}>
          <QuestionCard question={currentQuestion} isMobile={isMobile} />
          
          <div className={`grid ${isMobile ? 'gap-2' : 'gap-3'}`}>
            {currentQuestion.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                isAnswered={isAnswered}
                selectedChoice={selectedChoice}
                onClick={handleChoiceClick}
                isMobile={isMobile}
              />
            ))}
          </div>
          
          {isAnswered && (
            <div className={`${isMobile ? 'mt-4' : 'mt-6'} flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}>
              <div className={`bg-secondary/50 ${isMobile ? 'p-3' : 'p-4'} rounded-md`}>
                <p className={`font-medium mb-1 ${isMobile ? 'text-sm' : ''}`}>Explanation:</p>
                <p className={isMobile ? 'text-sm' : ''}>{currentQuestion.explanation}</p>
              </div>
              
              <Button onClick={handleNext} size={isMobile ? "default" : "default"} className="w-full">
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

