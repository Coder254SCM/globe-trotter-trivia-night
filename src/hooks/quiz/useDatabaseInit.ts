
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
        
        // Check if we have basic questions
        const stats = await CountryService.getDatabaseStats();
        console.log('📊 Database stats:', stats);
        
        if (stats.totalQuestions < 50) {
          console.log('🚀 Generating basic question set...');
          
          toast({
            title: "Generating Questions",
            description: "Setting up basic questions for popular countries...",
          });

          try {
            // Generate questions for top 5 most popular countries first
            const serviceCountries = await CountryService.getAllServiceCountries();
            const popularCountries = serviceCountries.filter(c => 
              ['united-states', 'united-kingdom', 'france', 'germany', 'japan'].includes(c.id)
            );
            
            console.log(`🎯 Generating questions for ${popularCountries.length} popular countries...`);
            
            for (const country of popularCountries) {
              try {
                console.log(`🔧 Generating for ${country.name}...`);
                
                // Generate questions for each difficulty
                await TemplateQuestionService.generateQuestions(country, 'easy', 3, 'Geography');
                await TemplateQuestionService.generateQuestions(country, 'medium', 3, 'Geography');
                await TemplateQuestionService.generateQuestions(country, 'hard', 3, 'Geography');
                
                // Small delay
                await new Promise(resolve => setTimeout(resolve, 200));
                
              } catch (error) {
                console.error(`❌ Failed to generate for ${country.name}:`, error);
              }
            }
            
            toast({
              title: "Questions Ready!",
              description: `Basic question set generated for popular countries.`,
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
