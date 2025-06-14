
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Choice, Country, Question, QuizResult } from "../types/quiz";
import { ArrowLeft, Clock, Globe, MapPin, Trophy, Flag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuizProps {
  country: Country | null;
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  onBack: () => void;
  isWeeklyChallenge?: boolean;
}

const Quiz = ({ country, questions, onFinish, onBack, isWeeklyChallenge = false }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime] = useState(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progress = useMemo(() => ((currentQuestionIndex + 1) / questions.length) * 100, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    // Reset state for each question
    setSelectedChoice(null);
    setIsAnswered(false);
    setImageLoaded(false);
    setImageError(false);
    
    // Set timer based on difficulty - shorter on mobile
    let timeLimit = 0;
    const mobileReduction = isMobile ? 5 : 0;
    switch (currentQuestion?.difficulty) {
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
            handleAnswer(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, currentQuestion?.difficulty, isMobile, isAnswered]);

  const handleAnswer = useCallback((choiceId: string | null) => {
    if (isAnswered) return;
    
    setSelectedChoice(choiceId);
    setIsAnswered(true);
    
    const correct = currentQuestion.choices.find(
      (choice) => choice.id === choiceId && choice.isCorrect
    );
    
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
      setCorrectQuestions((prev) => [...prev, currentQuestionIndex]);
    }
  }, [isAnswered, currentQuestion.choices, currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      setTotalTime(timeTaken);
      
      // Calculate score - more points for harder questions and faster answers
      const score = Math.round(
        (correctAnswers / questions.length) * 100
      );
      
      onFinish({
        totalQuestions: questions.length,
        correctAnswers,
        score,
        timeTaken,
        correctQuestions,
      });
    }
  }, [currentQuestionIndex, questions.length, startTime, correctAnswers, onFinish]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const getChoiceClassName = useCallback((choice: Choice) => {
    if (!isAnswered) {
      return selectedChoice === choice.id
        ? "border-primary bg-primary/10"
        : "border-border hover:border-primary/50";
    }
    
    if (choice.isCorrect) {
      return "border-green-500 bg-green-500/10";
    }
    
    if (selectedChoice === choice.id && !choice.isCorrect) {
      return "border-red-500 bg-red-500/10";
    }
    
    return "border-border opacity-50";
  }, [isAnswered, selectedChoice]);

  const getHeaderIcon = useMemo(() => {
    if (isWeeklyChallenge) {
      return <Trophy size={isMobile ? 16 : 20} className="text-amber-500" />;
    }
    
    if (country) {
      return <Flag size={isMobile ? 16 : 20} className="text-primary" />;
    }
    
    return <Globe size={isMobile ? 16 : 20} className="text-primary" />;
  }, [isWeeklyChallenge, country, isMobile]);

  const getHeaderTitle = useMemo(() => {
    if (isWeeklyChallenge) {
      return "Weekly Challenge";
    }
    
    return country ? `${country.name} Quiz` : "Global Quiz";
  }, [isWeeklyChallenge, country]);
  
  return (
    <div className={`min-h-screen w-full ${isMobile ? 'p-2' : 'p-4'} flex flex-col gap-${isMobile ? '4' : '8'} max-w-4xl mx-auto`}>
      <div className="flex items-center justify-between">
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
          {getHeaderIcon}
          <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{getHeaderTitle}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={isMobile ? 14 : 16} className={timeRemaining < 5 ? "text-red-500" : ""} />
          <span className={`${timeRemaining < 5 ? "text-red-500 font-medium" : ""} ${isMobile ? 'text-sm' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
          <span>Category: {currentQuestion?.category}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className={`${isMobile ? 'p-4' : 'p-6'} border-primary/20 shadow-lg shadow-primary/20`}>
        <div className={isMobile ? "mb-6" : "mb-8"}>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium mb-2`}>
            {currentQuestion?.text}
          </h2>
          
          {currentQuestion?.imageUrl && (
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
                    {!isMobile && <p className="text-sm">{currentQuestion.imageUrl}</p>}
                  </div>
                </div>
              )}
              
              <img 
                src={currentQuestion.imageUrl}
                alt="Question visual"
                className={`max-w-full rounded-md shadow-md ${isMobile ? 'max-h-40' : 'max-h-60'} object-contain ${!imageLoaded ? 'hidden' : ''}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}
          
          {currentQuestion?.audioUrl && (
            <div className={`${isMobile ? 'mt-3 mb-4' : 'mt-4 mb-6'} flex justify-center`}>
              <audio controls className="w-full max-w-md">
                <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        
        <div className={`grid gap-${isMobile ? '2' : '3'}`}>
          {currentQuestion?.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleAnswer(choice.id)}
              disabled={isAnswered}
              className={`
                ${isMobile ? 'p-3' : 'p-4'} rounded-md border-2 transition-all text-left flex items-center
                ${getChoiceClassName(choice)}
              `}
            >
              <span className={`${isMobile ? 'w-6 h-6 mr-2' : 'w-8 h-8 mr-3'} rounded-full bg-muted flex items-center justify-center ${isMobile ? 'text-sm' : ''}`}>
                {choice.id.toUpperCase()}
              </span>
              <span className={isMobile ? 'text-sm' : ''}>{choice.text}</span>
            </button>
          ))}
        </div>
        
        {isAnswered && (
          <div className={`${isMobile ? 'mt-4' : 'mt-6'} flex flex-col gap-${isMobile ? '3' : '4'}`}>
            <div className={`bg-secondary/50 ${isMobile ? 'p-3' : 'p-4'} rounded-md`}>
              <p className={`font-medium mb-1 ${isMobile ? 'text-sm' : ''}`}>Explanation:</p>
              <p className={isMobile ? 'text-sm' : ''}>{currentQuestion?.explanation}</p>
            </div>
            
            <Button onClick={handleNext} size={isMobile ? "default" : "default"} className="w-full">
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Quiz;
