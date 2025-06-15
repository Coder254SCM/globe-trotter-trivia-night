
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CountryService } from "@/services/supabase/countryService";
import { GameOrchestrator } from "@/services/production/gameOrchestrator";

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
        
        // Check database stats and generate if needed
        const stats = await CountryService.getDatabaseStats();
        console.log('📊 Database stats:', stats);
        
        if (stats.totalQuestions > 0) {
          toast({
            title: "Database Ready",
            description: `${stats.totalQuestions} questions available across ${stats.totalCountries} countries`,
          });
        } else {
          toast({
            title: "No Questions Found",
            description: "Attempting to generate initial questions. This may take a moment...",
          });

          try {
            const orchestrator = GameOrchestrator.getInstance();
            await orchestrator.initialize();
            
            const newStats = await CountryService.getDatabaseStats();
            if (newStats.totalQuestions > 0) {
              toast({
                title: "Questions Generated!",
                description: `Successfully generated ${newStats.totalQuestions} questions. The game is ready!`,
              });
            } else {
              toast({
                title: "Generation Complete, No Questions",
                description: "The generation process ran, but there are still no questions. Check console for errors.",
                variant: "destructive"
              });
            }
          } catch(e) {
             console.error('❌ Failed to auto-generate questions:', e);
             toast({
              title: "Generation Failed",
              description: "Could not automatically generate questions. Please use the admin panel.",
              variant: "destructive",
            });
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
};
