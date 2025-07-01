
import { useToast } from "@/hooks/use-toast";
import { QuestionService } from "@/services/supabase/questionService";
import { Country } from "@/types/quiz";
import { QuizManagerActions } from "./types";
import { randomizeQuestions, getRandomQuestions } from "@/utils/quiz/questionRandomizer";
import { BulkQuestionGenerator } from "@/services/simple/bulkQuestionGenerator";

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
          const randomizedQuestions = randomizeQuestions(cachedQuestions);
          setQuizQuestions(randomizedQuestions);
          setShowQuiz(true);
          setQuizResult(null);
          return;
        }

        let questions = await QuestionService.getFilteredQuestions({
          countryId: targetCountry.id,
          difficulty: targetCountry.difficulty,
          limit: Math.max(targetCount * 2, 100), // Get more questions for better randomization
          validateContent: true
        });
        
        if (questions.length === 0) {
          console.log(`🔄 No questions found, generating for ${targetCountry.name}...`);
          
          toast({
            title: "Generating Questions",
            description: `Creating 50+ unique questions for ${targetCountry.name}...`,
          });

          // Generate questions using the simple template system
          try {
            const { CountryService } = await import("@/services/supabase/countryService");
            const serviceCountries = await CountryService.getAllServiceCountries();
            const countryData = serviceCountries.find(c => c.id === targetCountry.id);

            if (countryData) {
              await BulkQuestionGenerator.generateForCountry(countryData, 50);
              
              // Wait and fetch again
              await new Promise(resolve => setTimeout(resolve, 2000));
              questions = await QuestionService.getFilteredQuestions({
                countryId: targetCountry.id,
                difficulty: targetCountry.difficulty,
                limit: Math.max(targetCount * 2, 100),
                validateContent: true
              });
              
              if (questions.length > 0) {
                toast({
                  title: "Questions Ready!",
                  description: `Generated ${questions.length} unique questions for ${targetCountry.name}`,
                });
              }
            }
          } catch (generationError) {
            console.error('Generation failed:', generationError);
            toast({
              title: "Generation Failed",
              description: "Could not generate questions. Please try a different country.",
              variant: "destructive",
            });
            return;
          }
        }
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `No questions found for ${targetCountry.name}. Try generating some!`,
            variant: "destructive",
          });
          return;
        }
        
        // Get random subset and randomize order
        const finalQuestions = getRandomQuestions(questions, targetCount);
        
        // Cache the questions
        questionCache.set(cacheKey, questions);
        cacheTimestamps.set(cacheKey, Date.now());
        
        setQuizQuestions(finalQuestions);
        setShowQuiz(true);
        setQuizResult(null);
        console.log(`✅ Loaded ${finalQuestions.length} randomized questions for ${targetCountry.name}`);
        
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
