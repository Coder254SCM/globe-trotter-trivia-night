
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuizService } from "@/services/supabase/quizService";
import { AIService } from "@/services/aiService";
import { supabase } from "@/integrations/supabase/client";
import { convertRawToSupabaseCountry } from "./countryConverter";

export const useDatabaseInit = () => {
  const { toast } = useToast();

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

    const initializeAIQuestions = async () => {
      try {
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

        // Convert to the format expected by AIService with proper type casting
        const supabaseCountries = (supabaseCountriesRaw || []).map(convertRawToSupabaseCountry);
        
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
          })
          .catch((error) => {
            console.error('AI generation failed:', error);
            toast({
              title: "AI Generation Failed",
              description: "Failed to generate questions. Using fallback questions.",
              variant: "destructive",
            });
          });
          
      } catch (error) {
        console.error('Failed to initialize AI questions:', error);
      }
    };

    initializeDatabase();
  }, [toast]);
};
