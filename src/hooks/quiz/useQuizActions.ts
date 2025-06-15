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
    console.log('🎯 Country clicked:', country.name, 'difficulty:', country.difficulty);
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
    console.log('🎯 Starting quiz with count:', count, 'for country:', selectedCountry?.name);
    setQuestionCount(count);
    setShowSettings(false);
    handleStartQuiz(undefined, count);
  };

  const handleStartQuiz = async (country?: Country, count?: number) => {
    const targetCountry = country || selectedCountry;
    const targetCount = count || questionCount;
    
    console.log('🎯 handleStartQuiz called with:', {
      country: targetCountry?.name,
      difficulty: targetCountry?.difficulty,
      count: targetCount
    });
    
    if (targetCountry) {
      try {
        console.log(`🎯 Loading ${targetCount} questions for ${targetCountry.name} (difficulty: ${targetCountry.difficulty})`);
        
        const cacheKey = `${targetCountry.id}-${targetCountry.difficulty}-${targetCount}`;
        const cachedQuestions = questionCache.get(cacheKey);
        const cacheTime = cacheTimestamps.get(cacheKey) || 0;

        if (cachedQuestions && (Date.now() - cacheTime) < cacheTimeout) {
          console.log(`✅ Using cached questions for ${targetCountry.name}`);
          setQuizQuestions(cachedQuestions);
          setShowQuiz(true);
          setQuizResult(null);
          return;
        }

        const questions = await QuestionService.getFilteredQuestions({
          countryId: targetCountry.id,
          difficulty: targetCountry.difficulty,
          limit: targetCount,
          validateContent: true
        });
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `No '${targetCountry.difficulty}' questions found for ${targetCountry.name}. Try generating some!`,
            variant: "destructive",
          });
          return;
        }
        
        // Cache the questions
        questionCache.set(cacheKey, questions);
        cacheTimestamps.set(cacheKey, Date.now());
        
        setQuizQuestions(questions);
        setShowQuiz(true);
        setQuizResult(null);
        console.log(`✅ Loaded ${questions.length} ${targetCountry.difficulty} questions for ${targetCountry.name}`);
        
      } catch (error) {
        console.error('Failed to load quiz questions:', error);
        toast({
          title: "Database Error",
          description: "Failed to load questions.",
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
