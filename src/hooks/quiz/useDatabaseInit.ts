
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
        
        // Check basic stats
        const stats = await CountryService.getDatabaseStats();
        console.log('📊 Database stats:', stats);
        
        toast({
          title: "System Ready",
          description: `${stats.totalQuestions} questions available across ${stats.totalCountries} countries`,
        });
        
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
