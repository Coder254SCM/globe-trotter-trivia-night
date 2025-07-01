import { useToast } from "@/hooks/use-toast";
import { QuestionService } from "@/services/supabase/questionService";
import { Country } from "@/types/quiz";
import { QuizManagerActions } from "./types";
import { randomizeQuestions, getRandomQuestions } from "@/utils/quiz/questionRandomizer";
import { DatabaseInitializationService } from "@/services/database/initializationService";

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

// Enhanced cache system
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
        
        // First, ensure this country has sufficient questions
        const hasQuestions = await DatabaseInitializationService.ensureCountryHasQuestions(targetCountry.id);
        
        if (!hasQuestions) {
          toast({
            title: "Generating Questions",
            description: `Creating questions for ${targetCountry.name}. This may take a moment...`,
          });
        }

        // Now fetch questions with larger buffer for randomization
        let questions = await QuestionService.getFilteredQuestions({
          countryId: targetCountry.id,
          difficulty: targetCountry.difficulty,
          limit: Math.max(targetCount * 3, 150), // Get 3x more for good randomization
          validateContent: true
        });
        
        console.log(`📊 Found ${questions.length} questions for ${targetCountry.name}`);
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `Unable to load questions for ${targetCountry.name}. Please try again.`,
            variant: "destructive",
          });
          return;
        }
        
        // Get random subset and randomize order
        const finalQuestions = getRandomQuestions(questions, targetCount);
        
        if (finalQuestions.length < targetCount) {
          toast({
            title: "Limited Questions",
            description: `Only ${finalQuestions.length} questions available for ${targetCountry.name}`,
          });
        }
        
        setQuizQuestions(finalQuestions);
        setShowQuiz(true);
        setQuizResult(null);
        console.log(`✅ Loaded ${finalQuestions.length} randomized questions for ${targetCountry.name}`);
        
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
