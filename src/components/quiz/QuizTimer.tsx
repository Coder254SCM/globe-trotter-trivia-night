
import { useEffect } from "react";

interface QuizTimerProps {
  timeRemaining: number;
  setTimeRemaining: (time: number | ((prev: number) => number)) => void;
  difficulty: string;
  isMobile: boolean;
  isAnswered: boolean;
  onTimeUp: () => void;
}

export const QuizTimer = ({ 
  timeRemaining, 
  setTimeRemaining, 
  difficulty, 
  isMobile, 
  isAnswered, 
  onTimeUp 
}: QuizTimerProps) => {
  useEffect(() => {
    // Set timer based on difficulty - shorter on mobile
    let timeLimit = 0;
    const mobileReduction = isMobile ? 5 : 0;
    switch (difficulty) {
      case 'easy':
        timeLimit = 20 - mobileReduction;
        break;
      case 'medium':
        timeLimit = 30 - mobileReduction;
        break;
      case 'hard':
        timeLimit = 40 - mobileReduction;
        break;
      default:
        timeLimit = 30 - mobileReduction;
    }
    
    setTimeRemaining(timeLimit);
    
    // Start countdown
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [difficulty, isMobile, isAnswered, setTimeRemaining, onTimeUp]);

  return null; // This component only handles the timer logic
};
