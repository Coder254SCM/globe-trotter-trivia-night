
import { useToast } from "@/hooks/use-toast";
import { QuizService } from "@/services/supabase/quizService";
import { AIService } from "@/services/aiService";
import { supabase } from "@/integrations/supabase/client";
import { Country } from "@/types/quiz";
import { convertRawToSupabaseCountry } from "./countryConverter";
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
        // Load questions for the selected country
        const questions = await QuizService.getQuestions(
          targetCountry.id, 
          targetCountry.difficulty || 'medium', 
          10
        );
        
        if (questions.length === 0) {
          // Try to generate questions on-demand
          toast({
            title: "Generating Questions",
            description: `AI is creating questions for ${targetCountry.name}...`,
          });
          
          try {
            // Get the country from Supabase in the format expected by AI service
            const { data: countryData, error } = await supabase
              .from('countries')
              .select('*')
              .eq('name', targetCountry.name)
              .single();

            if (error || !countryData) {
              throw new Error('Country not found in database');
            }

            // Convert to SupabaseCountry format with proper type casting
            const supabaseCountry = convertRawToSupabaseCountry(countryData);
            
            await AIService.generateAllDifficultyQuestions(supabaseCountry, 10);
            
            // Try loading questions again
            const newQuestions = await QuizService.getQuestions(
              targetCountry.id, 
              targetCountry.difficulty || 'medium', 
              10
            );
            
            if (newQuestions.length > 0) {
              setQuizQuestions(newQuestions);
              setShowQuiz(true);
              setQuizResult(null);
              toast({
                title: "Questions Ready",
                description: `Generated ${newQuestions.length} questions for ${targetCountry.name}!`,
              });
            } else {
              throw new Error('No questions generated');
            }
            
          } catch (aiError) {
            console.error('AI generation failed:', aiError);
            toast({
              title: "No Questions Available",
              description: `Unable to generate questions for ${targetCountry.name}. Please try another country.`,
              variant: "destructive",
            });
          }
          
          return;
        }
        
        setQuizQuestions(questions);
        setShowQuiz(true);
        setQuizResult(null);
      } catch (error) {
        console.error('Failed to load quiz questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions for this country.",
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
