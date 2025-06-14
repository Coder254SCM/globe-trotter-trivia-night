
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

// Cache for questions to prevent repeated requests
const questionCache = new Map<string, any[]>();
const cacheTimeout = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

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
        console.log(`🎯 Loading ${targetCount} questions for ${targetCountry.name} with rotation system (medium/hard only)`);
        
        // Force medium/hard difficulties only - no easy questions allowed
        let validDifficulty = targetCountry.difficulty;
        if (validDifficulty === 'easy') {
          console.warn('❌ Easy difficulty requested but not available - using medium instead');
          validDifficulty = 'medium';
        }
        
        // Ensure only medium or hard
        if (validDifficulty !== 'medium' && validDifficulty !== 'hard') {
          validDifficulty = 'medium';
        }
        
        // Check cache first
        const cacheKey = `${targetCountry.id}-${validDifficulty}-${targetCount}`;
        const cachedQuestions = questionCache.get(cacheKey);
        const cacheTime = cacheTimestamps.get(cacheKey) || 0;
        
        if (cachedQuestions && (Date.now() - cacheTime) < cacheTimeout) {
          console.log(`✅ Using cached medium/hard questions for ${targetCountry.name}`);
          setQuizQuestions(cachedQuestions);
          setShowQuiz(true);
          setQuizResult(null);
          return;
        }
        
        // Use rotation service to get current month questions (medium/hard only)
        const questions = await RotationService.getCurrentMonthQuestions(
          targetCountry.id, 
          validDifficulty, 
          targetCount
        );
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `No ${validDifficulty} questions found for ${targetCountry.name}. Easy questions have been removed from the system.`,
            variant: "destructive",
          });
          return;
        }
        
        // Transform to frontend format
        const transformedQuestions = questions.map(q => QuestionService.transformToFrontendQuestion(q));
        
        // Cache the questions
        questionCache.set(cacheKey, transformedQuestions);
        cacheTimestamps.set(cacheKey, Date.now());
        
        setQuizQuestions(transformedQuestions);
        setShowQuiz(true);
        setQuizResult(null);
        console.log(`✅ Loaded ${questions.length} ${validDifficulty} questions for ${targetCountry.name} (no easy questions)`);
        
      } catch (error) {
        console.error('Failed to load quiz questions:', error);
        toast({
          title: "Database Error",
          description: "Failed to load questions. Easy questions have been removed from the system.",
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
