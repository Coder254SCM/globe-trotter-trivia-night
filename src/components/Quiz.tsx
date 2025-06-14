
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Choice, Country, Question, QuizResult } from "../types/quiz";
import { ArrowLeft, Clock, Globe, Trophy, Flag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { GameSessionService } from "@/services/supabase/gameSessionService";
import { useAuth } from "@/hooks/useAuth";

interface QuizProps {
  country: Country | null;
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  onBack: () => void;
  isWeeklyChallenge?: boolean;
  challengeId?: string;
}

const Quiz = ({ country, questions, onFinish, onBack, isWeeklyChallenge = false, challengeId }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [failedQuestionIds, setFailedQuestionIds] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameSession, setGameSession] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progress = useMemo(() => ((currentQuestionIndex + 1) / questions.length) * 100, [currentQuestionIndex, questions.length]);

  // Force scroll to top immediately when quiz component mounts
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    scrollToTop();
    // Ensure scroll happens after any layout changes
    setTimeout(scrollToTop, 0);
  }, []);

  // Scroll to top whenever question changes
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    scrollToTop();
    // Ensure scroll happens after any layout changes
    setTimeout(scrollToTop, 0);
  }, [currentQuestionIndex]);

  // Debug logging with validation
  useEffect(() => {
    console.log('📋 Quiz initialized with:', {
      questionsCount: questions.length,
      currentQuestion: currentQuestion?.text?.substring(0, 50),
      difficulty: currentQuestion?.difficulty,
      hasChoices: currentQuestion?.choices?.length,
      choicesPreview: currentQuestion?.choices?.map(c => ({ id: c.id, text: c.text.substring(0, 20), isCorrect: c.isCorrect }))
    });

    // Validate current question quality
    if (currentQuestion) {
      const hasPlaceholder = currentQuestion.text?.toLowerCase().includes('placeholder') ||
                            currentQuestion.text?.includes('[country]') ||
                            currentQuestion.text?.includes('[capital]') ||
                            currentQuestion.text?.toLowerCase().includes('quantum physics') ||
                            currentQuestion.text?.toLowerCase().includes('methodology') ||
                            currentQuestion.text?.toLowerCase().includes('approach') ||
                            currentQuestion.text?.toLowerCase().includes('technique');
      
      const hasPlaceholderChoices = currentQuestion.choices?.some(c => 
        c.text.toLowerCase().includes('placeholder') ||
        c.text.toLowerCase().includes('option a for') ||
        c.text.toLowerCase().includes('incorrect option') ||
        c.text.toLowerCase().includes('methodology') ||
        c.text.toLowerCase().includes('approach') ||
        c.text.toLowerCase().includes('technique') ||
        c.text.toLowerCase().includes('advanced') ||
        c.text.toLowerCase().includes('cutting-edge') ||
        c.text.toLowerCase().includes('innovative') ||
        c.text.toLowerCase().includes('state-of-the-art')
      );

      if (hasPlaceholder || hasPlaceholderChoices) {
        console.error('❌ INVALID QUESTION DETECTED:', {
          hasPlaceholder,
          hasPlaceholderChoices,
          questionText: currentQuestion.text,
          choices: currentQuestion.choices?.map(c => c.text)
        });
      }
    }
  }, [questions, currentQuestion]);

  // Initialize game session
  useEffect(() => {
    const initSession = async () => {
      if (!user) return;
      
      try {
        const sessionType = isWeeklyChallenge ? 'weekly_challenge' : 'individual';
        const session = await GameSessionService.startSession(
          user.id,
          sessionType,
          questions.length,
          country?.id,
          country?.difficulty || 'medium'
        );
        setGameSession(session);
      } catch (error) {
        console.error('Failed to start game session:', error);
      }
    };

    initSession();
  }, [user, isWeeklyChallenge, questions.length, country]);

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
            handleTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, currentQuestion?.difficulty, isMobile, isAnswered]);

  const handleTimeUp = useCallback(() => {
    console.log('⏰ Time up! Auto-selecting wrong answer');
    setIsAnswered(true);
    setSelectedChoice(null);
    // Record as failed question
    setFailedQuestionIds((prev) => [...prev, currentQuestion.id]);
  }, [currentQuestion]);

  const handleChoiceClick = useCallback((choiceId: string) => {
    if (isAnswered) {
      console.log('⚠️ Answer already given for this question - ignoring click');
      return;
    }
    
    console.log('🎯 Choice clicked:', choiceId, 'Current isAnswered:', isAnswered);
    
    setIsAnswered(true);
    setSelectedChoice(choiceId);
    
    const selectedChoiceObj = currentQuestion.choices.find(choice => choice.id === choiceId);
    console.log('🔍 Selected choice object:', selectedChoiceObj);
    
    if (selectedChoiceObj?.isCorrect) {
      console.log('✅ Correct answer!');
      setCorrectAnswers((prev) => prev + 1);
      setCorrectQuestions((prev) => [...prev, currentQuestionIndex]);
    } else {
      console.log('❌ Wrong answer');
      setFailedQuestionIds((prev) => [...prev, currentQuestion.id]);
    }
  }, [isAnswered, currentQuestion, currentQuestionIndex]);

  const handleNext = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      
      // Calculate score
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      // Complete game session and record failed questions
      if (gameSession && user) {
        try {
          await GameSessionService.completeSession(
            gameSession.id,
            correctAnswers,
            score,
            timeTaken,
            failedQuestionIds
          );
        } catch (error) {
          console.error('Failed to complete session:', error);
        }
      }
      
      onFinish({
        totalQuestions: questions.length,
        correctAnswers,
        score,
        timeTaken,
        correctQuestions,
        failedQuestionIds
      });
    }
  }, [currentQuestionIndex, questions.length, startTime, correctAnswers, gameSession, user, failedQuestionIds, onFinish, correctQuestions]);

  const getChoiceClassName = useCallback((choice: Choice) => {
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
  }, [isAnswered, selectedChoice]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

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

  // Enhanced validation for current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
          <p className="text-muted-foreground mb-4">
            No questions found for this difficulty level or country.
          </p>
          <Button onClick={onBack}>Back to Globe</Button>
        </div>
      </div>
    );
  }

  // Check for invalid question data with enhanced validation
  const hasPlaceholderText = currentQuestion.text?.toLowerCase().includes('placeholder') ||
                             currentQuestion.text?.includes('[country]') ||
                             currentQuestion.text?.includes('[capital]') ||
                             currentQuestion.text?.toLowerCase().includes('quantum physics') ||
                             currentQuestion.text?.toLowerCase().includes('methodology') ||
                             currentQuestion.text?.toLowerCase().includes('approach') ||
                             currentQuestion.text?.toLowerCase().includes('technique');

  const hasInvalidChoices = !currentQuestion.choices || 
                           currentQuestion.choices.length < 4 ||
                           currentQuestion.choices.some(c => 
                             c.text.toLowerCase().includes('placeholder') ||
                             c.text.toLowerCase().includes('option a for') ||
                             c.text.toLowerCase().includes('incorrect option') ||
                             c.text.toLowerCase().includes('methodology') ||
                             c.text.toLowerCase().includes('approach') ||
                             c.text.toLowerCase().includes('technique') ||
                             c.text.toLowerCase().includes('advanced') ||
                             c.text.toLowerCase().includes('cutting-edge') ||
                             c.text.toLowerCase().includes('innovative') ||
                             c.text.toLowerCase().includes('state-of-the-art')
                           );

  if (hasPlaceholderText || hasInvalidChoices) {
    console.error('❌ Invalid question structure detected:', {
      hasPlaceholderText,
      hasInvalidChoices,
      currentQuestion
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Question Quality Issue</h2>
          <p className="text-muted-foreground mb-4">
            This question contains placeholder text or invalid data. Skipping to next question.
          </p>
          <Button onClick={() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
            } else {
              onBack();
            }
          }}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Back to Globe"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background" style={{ paddingTop: 0, marginTop: 0 }}>
      {/* Fixed header that stays at the very top */}
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
      </div>

      {/* Main content with proper spacing from top */}
      <div className={`${isMobile ? 'p-2 pt-4' : 'p-4 pt-6'} flex flex-col ${isMobile ? 'gap-4' : 'gap-6'} max-w-4xl mx-auto`}>
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
              {currentQuestion.text}
            </h2>
            
            {currentQuestion.imageUrl && (
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
          </div>
          
          <div className={`grid ${isMobile ? 'gap-2' : 'gap-3'}`}>
            {currentQuestion.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id)}
                disabled={isAnswered}
                className={getChoiceClassName(choice)}
              >
                <span className={`${isMobile ? 'w-6 h-6 mr-3 mt-1' : 'w-8 h-8 mr-4 mt-1'} flex-shrink-0 rounded-full bg-muted flex items-center justify-center ${isMobile ? 'text-sm' : ''} font-medium`}>
                  {choice.id.toUpperCase()}
                </span>
                <span className={`${isMobile ? 'text-sm' : ''} text-left flex-1`}>{choice.text}</span>
              </button>
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

export default Quiz;
