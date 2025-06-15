
import { Button } from "../ui/button";

interface QuizErrorProps {
  type: 'no-questions' | 'quality-issue';
  onBack: () => void;
  onSkip?: () => void;
  isLastQuestion?: boolean;
}

export const QuizError = ({ type, onBack, onSkip, isLastQuestion }: QuizErrorProps) => {
  const title = type === 'no-questions' ? "No Questions Available" : "Question Quality Issue";
  const message = type === 'no-questions' 
    ? "No questions found for this difficulty level or country."
    : "This question contains placeholder text or invalid data.";
  
  let buttonText = "Back to Globe";
  let handleClick = onBack;

  if (type === 'quality-issue') {
    buttonText = isLastQuestion ? "See Results" : "Next Question";
    handleClick = onSkip || onBack;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        <Button onClick={handleClick}>{buttonText}</Button>
      </div>
    </div>
  );
};

