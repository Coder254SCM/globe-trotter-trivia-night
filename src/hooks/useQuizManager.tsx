
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuizService } from "@/services/supabase/quizService";
import { AIService } from "@/services/aiService";
import { supabase } from "@/integrations/supabase/client";
import { Country, DifficultyLevel, QuestionCategory } from "@/types/quiz";
import { Country as SupabaseCountry } from "@/services/supabase/quizService";
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

  // Helper function to convert Supabase countries to our Country type
  const convertToCountryType = (supabaseCountries: any[]): Country[] => {
    return supabaseCountries.map(country => {
      // Find matching country in static data for position and code
      const staticCountry = countries.find(c => c.name === country.name);
      
      return {
        id: country.id,
        name: country.name,
        code: staticCountry?.code || country.name.substring(0, 3).toUpperCase(),
        position: staticCountry?.position || { lat: country.latitude || 0, lng: country.longitude || 0 },
        difficulty: (country.difficulty || 'medium') as DifficultyLevel,
        categories: (country.categories || []).filter((cat: string) => 
          // Only include valid QuestionCategory values
          ['History', 'Culture', 'Geography', 'Economy', 'Politics', 'Demographics', 'Science', 'Sports', 'Food', 'Art'].includes(cat)
        ) as QuestionCategory[],
        flagImageUrl: country.flag_url,
        continent: country.continent
      };
    });
  };

  // Helper function to convert Country to SupabaseCountry for AI service
  const convertToSupabaseCountry = (country: Country): SupabaseCountry => {
    return {
      id: country.id,
      name: country.name,
      capital: country.name, // Use name as fallback for capital
      continent: country.continent,
      population: 1000000, // Default population
      area_km2: 100000, // Default area
      latitude: country.position.lat,
      longitude: country.position.lng,
      flag_url: country.flagImageUrl || '',
      categories: country.categories,
      difficulty: country.difficulty
    };
  };

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
      
      // Get countries from Supabase in their native format for AI service
      const { data: supabaseCountriesRaw, error } = await supabase
        .from('countries')
        .select('*')
        .order('name')
        .limit(10); // Start with first 10

      if (error) {
        throw error;
      }

      // Convert to the format expected by AIService
      const supabaseCountries: SupabaseCountry[] = (supabaseCountriesRaw || []).map(country => ({
        id: country.id,
        name: country.name,
        capital: country.capital || country.name,
        continent: country.continent,
        population: country.population || 1000000,
        area_km2: country.area_km2 || 100000,
        latitude: country.latitude || 0,
        longitude: country.longitude || 0,
        flag_url: country.flag_url,
        categories: country.categories,
        difficulty: country.difficulty
      }));
      
      toast({
        title: "AI Generation Started",
        description: `Generating questions for ${supabaseCountries.length} countries using OpenRouter AI...`,
      });
      
      // Generate questions in background
      AIService.batchGenerateQuestions(supabaseCountries, 15)
        .then(() => {
          toast({
            title: "AI Generation Complete",
            description: `Successfully generated questions for ${supabaseCountries.length} countries!`,
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
            // Get the country from Supabase in the format expected by AI service
            const { data: countryData, error } = await supabase
              .from('countries')
              .select('*')
              .eq('name', targetCountry.name)
              .single();

            if (error || !countryData) {
              throw new Error('Country not found in database');
            }

            // Convert to SupabaseCountry format
            const supabaseCountry: SupabaseCountry = {
              id: countryData.id,
              name: countryData.name,
              capital: countryData.capital || countryData.name,
              continent: countryData.continent,
              population: countryData.population || 1000000,
              area_km2: countryData.area_km2 || 100000,
              latitude: countryData.latitude || 0,
              longitude: countryData.longitude || 0,
              flag_url: countryData.flag_url,
              categories: countryData.categories,
              difficulty: countryData.difficulty
            };
            
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
