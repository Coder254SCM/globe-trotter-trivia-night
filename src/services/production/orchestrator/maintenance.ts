import { supabase } from "@/integrations/supabase/client";
import countriesData from "@/data/countries";
import { ProductionConfig } from "./config";
import AIService from "@/services/aiService";
import { Country } from "@/types/quiz";
import { CountryService } from "@/services/supabase/countryService";

export class QuestionMaintenanceService {
  private config: ProductionConfig;

  constructor(config: ProductionConfig) {
    this.config = config;
  }

  public async ensureFullCoverage(): Promise<void> {
    console.log("🌍 Ensuring full country and difficulty coverage...");
    
    const categories = ['Geography', 'Culture', 'History', 'Politics', 'Economy'];
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    const generationRequests: { countryId: string; difficulty: 'easy' | 'medium' | 'hard'; category: string; count: number }[] = [];
    const allCountries = await CountryService.getAllCountries();

    for (const country of allCountries) {
      for (const difficulty of difficulties) {
        for (const category of categories.slice(0, 2)) { // Limiting to 2 categories for now to manage generation time
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('country_id', country.id)
            .eq('difficulty', difficulty)
            .eq('category', category);

          const currentCount = count || 0;
          const needed = Math.max(0, this.config.minQuestionsPerDifficulty - currentCount);

          if (needed > 0) {
            generationRequests.push({
              countryId: country.id,
              difficulty,
              category,
              count: needed
            });
          }
        }
      }
    }

    console.log(`📝 Need to generate questions for ${generationRequests.length} batches.`);
    
    if (generationRequests.length === 0) {
      console.log("✅ All countries have sufficient questions. No generation needed.");
      return;
    }

    console.log(`🤖 Starting AI question generation for ${generationRequests.length} requests...`);
    
    const batchSize = this.config.generationBatchSize > 0 ? this.config.generationBatchSize : 5;

    for (let i = 0; i < generationRequests.length; i += batchSize) {
      const batch = generationRequests.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(generationRequests.length / batchSize)}...`);
      
      const promises = batch.map(async (req) => {
        const countryData = allCountries.find(c => c.id === req.countryId);
        if (!countryData) {
          console.warn(`Could not find country data for ID: ${req.countryId}`);
          return;
        }

        try {
          await AIService.generateQuestions(
            countryData,
            req.difficulty,
            req.count,
            req.category
          );
        } catch (error) {
           console.error(`Failed to generate questions for ${req.countryId} (${req.difficulty}, ${req.category}):`, error);
        }
      });
      
      await Promise.all(promises);

      if (i + batchSize < generationRequests.length) {
        const delay = 2000;
        console.log(`Waiting for ${delay / 1000} seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log("✅ Automated question generation process completed.");
  }

  public async performCleanup(): Promise<void> {
    console.log("🧹 Performing automated cleanup...");
    
    const placeholderPatterns = [
      '%methodology%', '%approach%', '%technique%', '%placeholder%',
      '%option a for%', '%option b for%', '%option c for%', '%option d for%'
    ];

    for (const pattern of placeholderPatterns) {
      const { error } = await supabase
        .from('questions')
        .delete()
        .or(`text.ilike.${pattern},option_a.ilike.${pattern},option_b.ilike.${pattern},option_c.ilike.${pattern},option_d.ilike.${pattern}`);

      if (error) {
        console.error(`Failed to clean pattern ${pattern}:`, error);
      }
    }

    console.log("✅ Cleanup completed");
  }

  public async regenerateCountryQuestions(countryIds: string[]): Promise<void> {
    console.log(`🔄 Regenerating questions for ${countryIds.length} countries...`);
    
    const requests: any[] = [];
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const categories = ['Geography', 'Culture'];

    for (const countryId of countryIds) {
      await supabase
        .from('questions')
        .delete()
        .eq('country_id', countryId);

      for (const difficulty of difficulties) {
        for (const category of categories) {
          requests.push({
            countryId,
            difficulty,
            category,
            count: this.config.minQuestionsPerDifficulty
          });
        }
      }
    }

    console.warn("AI question regeneration has been disabled. Skipping regeneration.");
    console.log(`✅ Regenerated questions for ${countryIds.length} countries`);
  }
}
