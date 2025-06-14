
import { useToast } from "@/hooks/use-toast";
import { QuestionService } from "@/services/supabase/questionService";
import { supabase } from "@/integrations/supabase/client";
import { Country } from "@/types/quiz";
import { QuizManagerActions } from "./types";

interface UseQuizActionsProps {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
  setShowQuiz: (show: boolean) => void;
  setQuizResult: (result: any) => void;
  setQuizQuestions: (questions: any[]) => void;
}

export const useQuizActions = ({
  selectedCountry,
  setSelectedCountry,
  setShowQuiz,
  setQuizResult,
  setQuizQuestions
}: UseQuizActionsProps): QuizManagerActions => {
  const { toast } = useToast();

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
    setShowQuiz(false);
    setQuizResult(null);
    
    // Auto-start quiz for better UX
    handleStartQuiz(country);
  };

  const handleStartQuiz = async (country?: Country) => {
    const targetCountry = country || selectedCountry;
    if (targetCountry) {
      try {
        console.log(`🎯 Loading questions for ${targetCountry.name} from Supabase only`);
        
        // Load questions for the selected country from Supabase ONLY
        const questions = await QuestionService.getQuestions(
          targetCountry.id, 
          targetCountry.difficulty || 'medium', 
          10
        );
        
        if (questions.length === 0) {
          // Try different difficulties if no questions found
          const difficulties = ['easy', 'medium', 'hard'];
          let foundQuestions = [];
          
          for (const difficulty of difficulties) {
            foundQuestions = await QuestionService.getQuestions(
              targetCountry.id, 
              difficulty, 
              10
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
    setQuizResult(null);
  };

  const handleRetryQuiz = () => {
    setQuizResult(null);
    setShowQuiz(true);
  };

  return {
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz
  };
};
