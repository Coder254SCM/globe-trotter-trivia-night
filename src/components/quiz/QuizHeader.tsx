
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Globe, Trophy, Flag } from "lucide-react";

interface QuizHeaderProps {
  onBack: () => void;
  isWeeklyChallenge: boolean;
  countryName?: string;
  timeRemaining: number;
  isMobile: boolean;
}

export const QuizHeader = ({ 
  onBack, 
  isWeeklyChallenge, 
  countryName, 
  timeRemaining, 
  isMobile 
}: QuizHeaderProps) => {
  const getHeaderIcon = () => {
    if (isWeeklyChallenge) {
      return <Trophy size={isMobile ? 16 : 20} className="text-amber-500" />;
    }
    
    if (countryName) {
      return <Flag size={isMobile ? 16 : 20} className="text-primary" />;
    }
    
    return <Globe size={isMobile ? 16 : 20} className="text-primary" />;
  };

  const getHeaderTitle = () => {
    if (isWeeklyChallenge) {
      return "Weekly Challenge";
    }
    
    return countryName ? `${countryName} Quiz` : "Global Quiz";
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className={`${isMobile ? 'p-2' : 'p-4'} flex items-center justify-between max-w-4xl mx-auto`}>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "sm"}
          className="flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft size={isMobile ? 14 : 16} />
          <Globe size={isMobile ? 14 : 16} />
          {!isMobile && "Back to Globe"}
        </Button>
        
        <div className="flex items-center gap-2">
          {getHeaderIcon()}
          <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{getHeaderTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={isMobile ? 14 : 16} className={timeRemaining < 5 ? "text-red-500" : ""} />
          <span className={`${timeRemaining < 5 ? "text-red-500 font-medium" : ""} ${isMobile ? 'text-sm' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
      </div>
    </div>
  );
};
