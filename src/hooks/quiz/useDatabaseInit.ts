
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
        
        // Check database stats and force generation if needed
        const stats = await CountryService.getDatabaseStats();
        console.log('📊 Database stats:', stats);
        
        if (stats.totalQuestions === 0) {
          console.log('🚀 No questions found - forcing immediate generation...');
          
          toast({
            title: "Generating Questions",
            description: "No questions found. Starting immediate generation process...",
          });

          try {
            // Generate questions for first 10 countries immediately
            const serviceCountries = await CountryService.getAllServiceCountries();
            const firstCountries = serviceCountries.slice(0, 10);
            
            console.log(`🎯 Generating questions for first ${firstCountries.length} countries...`);
            
            const generationPromises = firstCountries.map(async (country) => {
              try {
                console.log(`🔧 Generating for ${country.name}...`);
                await TemplateQuestionService.generateQuestions(country, 'medium', 5, 'Geography');
                await TemplateQuestionService.generateQuestions(country, 'easy', 3, 'Culture');
              } catch (error) {
                console.error(`❌ Failed to generate for ${country.name}:`, error);
              }
            });
            
            await Promise.all(generationPromises);
            
            // Check stats again
            setTimeout(async () => {
              const newStats = await CountryService.getDatabaseStats();
              console.log('📊 Updated stats after generation:', newStats);
              
              if (newStats.totalQuestions > 0) {
                toast({
                  title: "Questions Ready!",
                  description: `Successfully generated ${newStats.totalQuestions} questions. The game is now ready to play!`,
                });
              }
            }, 2000);
            
          } catch(e) {
             console.error('❌ Failed to auto-generate questions:', e);
             toast({
              title: "Generation Failed",
              description: "Could not automatically generate questions. Please try the admin panel.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Database Ready",
            description: `${stats.totalQuestions} questions available across ${stats.totalCountries} countries`,
          });
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
};
