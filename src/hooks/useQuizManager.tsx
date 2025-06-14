
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuizService } from "@/services/supabase/quizService";
import { Country, DifficultyLevel } from "@/types/quiz";
import countries from "@/data/countries";

export const useQuizManager = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  // Use the static countries data directly - all 195 countries
  const allCountries = countries;

  // Load countries into Supabase if not already there
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('🌍 Checking database for countries...');
        const supabaseCountries = await QuizService.getAllCountries();
        
        if (supabaseCountries.length < 195) {
          console.log(`⚠️ Only ${supabaseCountries.length} countries in database. Populating all 195...`);
          await QuizService.populateAllCountries();
          
          toast({
            title: "Database Updated",
            description: `Successfully populated all 195 countries!`,
          });
        } else {
          console.log(`✅ Database already has ${supabaseCountries.length} countries`);
        }
        
      } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        toast({
          title: "Database Error",
          description: "Failed to initialize countries database.",
          variant: "destructive",
        });
      }
    };

    initializeDatabase();
  }, [toast]);

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
    setShowQuiz(false);
    setQuizResult(null);
  };

  const handleStartQuiz = async () => {
    if (selectedCountry) {
      try {
        // Load questions for the selected country
        const questions = await QuizService.getQuestions(
          selectedCountry.id, 
          selectedCountry.difficulty || 'medium', 
          10
        );
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `No questions found for ${selectedCountry.name}. Please generate questions first.`,
            variant: "destructive",
          });
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
    allCountries,
    selectedCountry,
    showQuiz,
    quizResult,
    quizQuestions,
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz
  };
};
