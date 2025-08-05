
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Question } from "@/types/quiz";
import { QuestionVoting } from "./QuestionVoting";

interface QuestionCardProps {
  question: Question;
  isMobile: boolean;
}

export const QuestionCard = ({ question, isMobile }: QuestionCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className={isMobile ? "mb-6" : "mb-8"}>
      <div className="flex justify-between items-start gap-4 mb-2">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium flex-1`}>
          {question.text}
        </h2>
        <QuestionVoting 
          questionId={question.id} 
          questionText={question.text}
          className="flex-shrink-0"
        />
      </div>
      
      {question.imageUrl && (
        <div className={`${isMobile ? 'mt-3 mb-4' : 'mt-4 mb-6'} flex justify-center`}>
          {!imageLoaded && !imageError && (
            <div className={`w-full ${isMobile ? 'max-h-40' : 'max-h-60'} flex items-center justify-center bg-muted rounded-md`}>
              <div className="animate-pulse text-muted-foreground">Loading image...</div>
            </div>
          )}
          
          {imageError && (
            <div className={`w-full ${isMobile ? 'h-32' : 'h-40'} flex items-center justify-center bg-muted rounded-md`}>
              <div className="text-muted-foreground text-center">
                <p className={isMobile ? 'text-sm' : ''}>Image could not be loaded</p>
                {!isMobile && <p className="text-sm">{question.imageUrl}</p>}
              </div>
            </div>
          )}
          
          <img 
            src={question.imageUrl}
            alt="Question visual"
            className={`max-w-full rounded-md shadow-md ${isMobile ? 'max-h-40' : 'max-h-60'} object-contain ${!imageLoaded ? 'hidden' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
    </div>
  );
};
