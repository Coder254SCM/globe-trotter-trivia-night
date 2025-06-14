
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuizService } from "@/services/supabase/quizService";
import { AIService } from "@/services/aiService";
import { Country, DifficultyLevel } from "@/types/quiz";
import countries from "@/data/countries";

export const useQuizManager = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const { toast } = useToast();

  // Use the static countries data directly - all 195 countries
  const allCountries = countries;

  // Load countries into Supabase and initialize AI question generation
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
          
          // Check if we need to generate questions
          const stats = await QuizService.getDatabaseStats();
          if (stats.totalQuestions < 1000) {
            toast({
              title: "AI Question Generation",
              description: "Starting AI question generation for all countries...",
            });
            
            // Start AI question generation in background
            initializeAIQuestions();
          }
        } else {
          console.log(`✅ Database already has ${supabaseCountries.length} countries`);
          
          // Check if we need more questions
          const stats = await QuizService.getDatabaseStats();
          console.log('📊 Database stats:', stats);
          
          if (stats.totalQuestions < 500) {
            toast({
              title: "Generating Questions",
              description: "AI is generating questions for countries with low question counts...",
            });
            initializeAIQuestions();
          }
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

  const initializeAIQuestions = async () => {
    try {
      setIsGeneratingQuestions(true);
      
      // Check if OpenRouter is available
      const isAvailable = await AIService.isOpenRouterAvailable();
      if (!isAvailable) {
        toast({
          title: "AI Service Unavailable",
          description: "OpenRouter API is not accessible. Please check your API key.",
          variant: "destructive",
        });
        return;
      }
      
      // Get countries from Supabase and map to Country format
      const supabaseCountries = await QuizService.getAllCountries();
      
      // Convert Supabase countries to Country format for AI service
      const countriesForAI: Country[] = supabaseCountries.map(country => {
        // Find matching country from static data to get position info
        const staticCountry = allCountries.find(c => c.name === country.name);
        
        return {
          id: country.id,
          name: country.name,
          code: country.id.substring(0, 3).toUpperCase(), // Generate code from ID
          position: staticCountry?.position || { lat: 0, lng: 0 }, // Use static data or default
          difficulty: (country.difficulty as DifficultyLevel) || 'medium',
          categories: [], // Will be populated by AI
          continent: country.continent,
          flagImageUrl: country.flag_url || undefined,
        };
      });
      
      // Start batch generation for countries with few questions
      const countriesNeedingQuestions = countriesForAI.slice(0, 10); // Start with first 10
      
      toast({
        title: "AI Generation Started",
        description: `Generating questions for ${countriesNeedingQuestions.length} countries using OpenRouter AI...`,
      });
      
      // Generate questions in background
      AIService.batchGenerateQuestions(countriesNeedingQuestions, 15)
        .then(() => {
          toast({
            title: "AI Generation Complete",
            description: `Successfully generated questions for ${countriesNeedingQuestions.length} countries!`,
          });
          setIsGeneratingQuestions(false);
        })
        .catch((error) => {
          console.error('AI generation failed:', error);
          toast({
            title: "AI Generation Failed",
            description: "Failed to generate questions. Using fallback questions.",
            variant: "destructive",
          });
          setIsGeneratingQuestions(false);
        });
        
    } catch (error) {
      console.error('Failed to initialize AI questions:', error);
      setIsGeneratingQuestions(false);
    }
  };

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
            // Create proper Country object for AI generation
            const countryForAI: Country = {
              id: targetCountry.id,
              name: targetCountry.name,
              code: targetCountry.code,
              position: targetCountry.position,
              difficulty: targetCountry.difficulty || 'medium',
              categories: targetCountry.categories || [],
              continent: targetCountry.continent,
              flagImageUrl: targetCountry.flagImageUrl,
            };
            
            await AIService.generateAllDifficultyQuestions(countryForAI, 10);
            
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
    allCountries,
    selectedCountry,
    showQuiz,
    quizResult,
    quizQuestions,
    isGeneratingQuestions,
    handleCountryClick,
    handleStartQuiz,
    handleQuizComplete,
    handleBackToGlobe,
    handleRetryQuiz
  };
};
