
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CountryService } from "@/services/supabase/countryService";
import { TemplateQuestionService } from "@/services/templateQuestionService";

export const useDatabaseInit = () => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('🌍 Checking database for countries...');
        const supabaseCountries = await CountryService.getAllCountries();
        
        if (supabaseCountries.length < 195) {
          console.log(`⚠️ Only ${supabaseCountries.length} countries in database. Populating all 195...`);
          await CountryService.populateAllCountries();
          
          toast({
            title: "Database Updated",
            description: `Successfully populated all 195 countries!`,
          });
        } else {
          console.log(`✅ Database already has ${supabaseCountries.length} countries`);
        }
        
        // Check if we have any questions at all
        const stats = await CountryService.getDatabaseStats();
        console.log('📊 Database stats:', stats);
        
        if (stats.totalQuestions < 100) {
          console.log('🚀 Starting basic question generation...');
          
          toast({
            title: "Generating Questions",
            description: "Setting up basic questions for the quiz system...",
          });

          try {
            // Get first 10 countries for initial generation
            const serviceCountries = await CountryService.getAllServiceCountries();
            const firstCountries = serviceCountries.slice(0, 10);
            
            console.log(`🎯 Generating questions for ${firstCountries.length} countries...`);
            
            for (const country of firstCountries) {
              try {
                console.log(`🔧 Generating for ${country.name}...`);
                
                // Generate a few questions for each difficulty
                await TemplateQuestionService.generateQuestions(country, 'easy', 2, 'Geography');
                await TemplateQuestionService.generateQuestions(country, 'medium', 2, 'Geography');
                await TemplateQuestionService.generateQuestions(country, 'hard', 2, 'Culture');
                
                // Small delay to avoid overwhelming the system
                await new Promise(resolve => setTimeout(resolve, 100));
                
              } catch (error) {
                console.error(`❌ Failed to generate for ${country.name}:`, error);
              }
            }
            
            toast({
              title: "Questions Ready!",
              description: `Basic question set generated. You can now start quizzes!`,
            });
            
          } catch(e) {
             console.error('❌ Failed to generate initial questions:', e);
             toast({
              title: "Generation Issue",
              description: "Some questions may be missing. The system will generate them as needed.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "System Ready",
            description: `${stats.totalQuestions} questions available across ${stats.totalCountries} countries`,
          });
        }
        
      } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        toast({
          title: "Database Error",
          description: "Failed to initialize database. Some features may not work properly.",
          variant: "destructive",
        });
      }
    };

    initializeDatabase();
  }, [toast]);
};
