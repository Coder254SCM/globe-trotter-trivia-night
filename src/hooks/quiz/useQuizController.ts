
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GameSessionService } from "@/services/supabase/gameSessionService";
import { Country, Question, QuizResult } from "@/types/quiz";

interface UseQuizControllerProps {
  country: Country | null;
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  isWeeklyChallenge?: boolean;
}

export const useQuizController = ({
  country,
  questions,
  onFinish,
  isWeeklyChallenge = false,
}: UseQuizControllerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [failedQuestionIds, setFailedQuestionIds] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameSession, setGameSession] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const { user } = useAuth();

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    scrollToTop();
    setTimeout(scrollToTop, 0);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!currentQuestion) return;
    
    console.log('📋 Quiz question:', {
      questionIndex: currentQuestionIndex,
      text: currentQuestion.text?.substring(0, 50),
      difficulty: currentQuestion.difficulty,
    });
  }, [currentQuestion, currentQuestionIndex]);

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

    if (questions.length > 0) {
      initSession();
    }
  }, [user, isWeeklyChallenge, questions.length, country]);

  useEffect(() => {
    setSelectedChoice(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;
    console.log('⏰ Time up! Auto-selecting wrong answer');
    setIsAnswered(true);
    setSelectedChoice(null);
    if (currentQuestion) {
      setFailedQuestionIds((prev) => [...prev, currentQuestion.id]);
    }
  }, [isAnswered, currentQuestion]);

  const handleChoiceClick = useCallback((choiceId: string) => {
    if (isAnswered) {
      return;
    }
    
    setIsAnswered(true);
    setSelectedChoice(choiceId);
    
    const selectedChoiceObj = currentQuestion.choices.find(choice => choice.id === choiceId);
    
    if (selectedChoiceObj?.isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setCorrectQuestions((prev) => [...prev, currentQuestionIndex]);
    } else {
      setFailedQuestionIds((prev) => [...prev, currentQuestion.id]);
    }
  }, [isAnswered, currentQuestion, currentQuestionIndex]);

  const handleNext = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      const score = Math.round((correctAnswers / questions.length) * 100);
      
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

  const handleSkip = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000);
        const score = Math.round((correctAnswers / questions.length) * 100);
        onFinish({
            totalQuestions: questions.length,
            correctAnswers,
            score,
            timeTaken,
            correctQuestions,
            failedQuestionIds
        });
    }
  }, [currentQuestionIndex, questions.length, onFinish, startTime, correctAnswers, correctQuestions, failedQuestionIds]);
  
  return {
    currentQuestionIndex,
    currentQuestion,
    selectedChoice,
    isAnswered,
    timeRemaining,
    setTimeRemaining,
    handleTimeUp,
    handleChoiceClick,
    handleNext,
    handleSkip,
  };
};

