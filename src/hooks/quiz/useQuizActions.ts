
import { useToast } from "@/hooks/use-toast";
import { QuestionService } from "@/services/supabase/questionService";
import { RotationService } from "@/services/supabase/rotationService";
import { Country } from "@/types/quiz";
import { QuizManagerActions } from "./types";

interface UseQuizActionsProps {
  selectedCountry: Country | null;
  questionCount: number;
  setSelectedCountry: (country: Country | null) => void;
  setShowQuiz: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setQuizResult: (result: any) => void;
  setQuizQuestions: (questions: any[]) => void;
  setQuestionCount: (count: number) => void;
}

export const useQuizActions = ({
  selectedCountry,
  questionCount,
  setSelectedCountry,
  setShowQuiz,
  setShowSettings,
  setQuizResult,
  setQuizQuestions,
  setQuestionCount
}: UseQuizActionsProps): QuizManagerActions => {
  const { toast } = useToast();

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
    setShowQuiz(false);
    setShowSettings(true);
    setQuizResult(null);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
    setShowQuiz(false);
    setQuizResult(null);
  };

  const handleStartQuizWithCount = (count: number) => {
    setQuestionCount(count);
    setShowSettings(false);
    handleStartQuiz(undefined, count);
  };

  const handleStartQuiz = async (country?: Country, count?: number) => {
    const targetCountry = country || selectedCountry;
    const targetCount = count || questionCount;
    
    if (targetCountry) {
      try {
        console.log(`🎯 Loading ${targetCount} questions for ${targetCountry.name} with rotation system`);
        
        // Use new rotation service to get current month questions (includes community questions)
        const questions = await RotationService.getCurrentMonthQuestions(
          targetCountry.id, 
          targetCountry.difficulty || 'medium', 
          targetCount
        );
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `No questions found for ${targetCountry.name}. Please check back later or try the manual question generator.`,
            variant: "destructive",
          });
          return;
        }
        
        // Transform to frontend format
        const transformedQuestions = questions.map(q => QuestionService.transformToFrontendQuestion(q));
        
        setQuizQuestions(transformedQuestions);
        setShowQuiz(true);
        setQuizResult(null);
        console.log(`✅ Loaded ${questions.length} questions for ${targetCountry.name} (including community questions)`);
        
      } catch (error) {
        console.error('Failed to load quiz questions:', error);
        toast({
          title: "Database Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleQuizComplete = (result: any) => {
    setQuizResult(result);
    setShowQuiz(false);
  };

  const handleBackToGlobe = () => {
    setSelectedCountry(null);
    setShowQuiz(false);
    setShowSettings(false);
    setQuizResult(null);
  };

  const handleRetryQuiz = () => {
    setQuizResult(null);
    setShowSettings(true);
  };

  return {
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz,
    handleShowSettings,
    handleStartQuizWithCount
  };
};
