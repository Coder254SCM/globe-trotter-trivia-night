
import { Choice } from "@/types/quiz";

interface ChoiceButtonProps {
  choice: Choice;
  isAnswered: boolean;
  selectedChoice: string | null;
  onClick: (choiceId: string) => void;
  isMobile: boolean;
}

export const ChoiceButton = ({ 
  choice, 
  isAnswered, 
  selectedChoice, 
  onClick, 
  isMobile 
}: ChoiceButtonProps) => {
  const getChoiceClassName = () => {
    const baseClasses = "p-4 rounded-md border-2 transition-all text-left flex items-start hover:bg-muted/50";
    
    if (!isAnswered) {
      return selectedChoice === choice.id
        ? `${baseClasses} border-primary bg-primary/10 cursor-pointer`
        : `${baseClasses} border-border hover:border-primary/50 cursor-pointer`;
    }
    
    if (choice.isCorrect) {
      return `${baseClasses} border-green-500 bg-green-500/10`;
    }
    
    if (selectedChoice === choice.id && !choice.isCorrect) {
      return `${baseClasses} border-red-500 bg-red-500/10`;
    }
    
    return `${baseClasses} border-border opacity-50`;
  };

  return (
    <button
      onClick={() => onClick(choice.id)}
      disabled={isAnswered}
      className={getChoiceClassName()}
    >
      <span className={`${isMobile ? 'w-6 h-6 mr-3 mt-1' : 'w-8 h-8 mr-4 mt-1'} flex-shrink-0 rounded-full bg-muted flex items-center justify-center ${isMobile ? 'text-sm' : ''} font-medium`}>
        {choice.id.toUpperCase()}
      </span>
      <span className={`${isMobile ? 'text-sm' : ''} text-left flex-1`}>{choice.text}</span>
    </button>
  );
};
