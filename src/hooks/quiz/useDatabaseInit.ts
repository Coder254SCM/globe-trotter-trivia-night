
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CountryService } from "@/services/supabase/countryService";

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
        
        // Check database stats without trying to generate AI questions
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
            description: "Use the admin panel to generate questions for countries.",
            variant: "destructive",
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
