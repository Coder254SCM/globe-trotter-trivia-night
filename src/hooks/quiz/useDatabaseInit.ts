
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
        
        if (stats.totalQuestions < 1000) { // Increased threshold to ensure we have enough questions
          console.log('🚀 Insufficient questions found - starting comprehensive generation...');
          
          toast({
            title: "Generating Questions",
            description: "Generating questions for all countries and difficulties. This may take a moment...",
          });

          try {
            // Generate questions for ALL countries with all difficulties
            const serviceCountries = await CountryService.getAllServiceCountries();
            const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
            const categories = ['Geography', 'Culture', 'History'];
            
            console.log(`🎯 Generating questions for ${serviceCountries.length} countries...`);
            
            // Process countries in smaller batches to avoid overwhelming the system
            for (let i = 0; i < serviceCountries.length; i += 5) {
              const batch = serviceCountries.slice(i, i + 5);
              
              const batchPromises = batch.map(async (country) => {
                try {
                  console.log(`🔧 Generating for ${country.name}...`);
                  
                  for (const difficulty of difficulties) {
                    for (const category of categories) {
                      await TemplateQuestionService.generateQuestions(
                        country, 
                        difficulty, 
                        3, // Generate 3 questions per difficulty/category combination
                        category
                      );
                    }
                  }
                } catch (error) {
                  console.error(`❌ Failed to generate for ${country.name}:`, error);
                }
              });
              
              await Promise.all(batchPromises);
              
              // Small delay between batches
              if (i + 5 < serviceCountries.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
            
            // Check stats again after generation
            setTimeout(async () => {
              const newStats = await CountryService.getDatabaseStats();
              console.log('📊 Updated stats after generation:', newStats);
              
              if (newStats.totalQuestions > 0) {
                toast({
                  title: "Questions Ready!",
                  description: `Successfully generated ${newStats.totalQuestions} questions. All features are now available!`,
                });
              }
            }, 3000);
            
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
