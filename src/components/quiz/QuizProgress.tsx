
import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  category: string;
  isMobile: boolean;
}

export const QuizProgress = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  category, 
  isMobile 
}: QuizProgressProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
        <span>Question {currentQuestionIndex + 1}/{totalQuestions}</span>
        <span>Category: {category}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
