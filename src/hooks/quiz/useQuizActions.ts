
import { useToast } from "@/hooks/use-toast";
import { QuestionService } from "@/services/supabase/questionService";
import { supabase } from "@/integrations/supabase/client";
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
        console.log(`🎯 Loading ${targetCount} questions for ${targetCountry.name} from Supabase only`);
        
        // Load questions for the selected country from Supabase ONLY
        const questions = await QuestionService.getQuestions(
          targetCountry.id, 
          targetCountry.difficulty || 'medium', 
          targetCount
        );
        
        if (questions.length === 0) {
          // Try different difficulties if no questions found
          const difficulties = ['easy', 'medium', 'hard'];
          let foundQuestions = [];
          
          for (const difficulty of difficulties) {
            foundQuestions = await QuestionService.getQuestions(
              targetCountry.id, 
              difficulty, 
              targetCount
            );
            if (foundQuestions.length > 0) {
              console.log(`✅ Found ${foundQuestions.length} ${difficulty} questions for ${targetCountry.name}`);
              break;
            }
          }
          
          if (foundQuestions.length === 0) {
            toast({
              title: "No Questions Available",
              description: `No questions found for ${targetCountry.name} in the database. Please use the admin panel to generate questions first.`,
              variant: "destructive",
            });
            return;
          }
          
          setQuizQuestions(foundQuestions);
          setShowQuiz(true);
          setQuizResult(null);
          return;
        }
        
        setQuizQuestions(questions);
        setShowQuiz(true);
        setQuizResult(null);
        console.log(`✅ Loaded ${questions.length} questions for ${targetCountry.name} from Supabase`);
        
      } catch (error) {
        console.error('Failed to load quiz questions from Supabase:', error);
        toast({
          title: "Database Error",
          description: "Failed to load questions from the database. Please try again.",
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
