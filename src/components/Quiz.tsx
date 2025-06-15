import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Choice, Country, Question, QuizResult } from "../types/quiz";
import { useIsMobile } from "@/hooks/use-mobile";
import { GameSessionService } from "@/services/supabase/gameSessionService";
import { useAuth } from "@/hooks/useAuth";
import { QuizHeader } from "./quiz/QuizHeader";
import { QuizProgress } from "./quiz/QuizProgress";
import { QuestionCard } from "./quiz/QuestionCard";
import { ChoiceButton } from "./quiz/ChoiceButton";
import { QuizTimer } from "./quiz/QuizTimer";

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
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

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
  }, [currentQuestionIndex]);

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
    <div className="fixed inset-0 w-full bg-background overflow-auto" style={{ paddingTop: 0, marginTop: 0 }}>
      <QuizTimer
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        difficulty={currentQuestion?.difficulty || 'medium'}
        isMobile={isMobile}
        isAnswered={isAnswered}
        onTimeUp={handleTimeUp}
      />

      <QuizHeader
        onBack={onBack}
        isWeeklyChallenge={isWeeklyChallenge}
        countryName={country?.name}
        timeRemaining={timeRemaining}
        isMobile={isMobile}
      />

      {/* Main content with proper spacing from top */}
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

export default Quiz;
