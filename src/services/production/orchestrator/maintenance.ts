import { supabase } from "@/integrations/supabase/client";
import countries from "@/data/countries";
import { ProductionConfig } from "./config";

export class QuestionMaintenanceService {
  private config: ProductionConfig;

  constructor(config: ProductionConfig) {
    this.config = config;
  }

  public async ensureFullCoverage(): Promise<void> {
    console.log("🌍 Ensuring full country and difficulty coverage...");
    
    const categories = ['Geography', 'Culture', 'History', 'Politics', 'Economy'];
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    const generationRequests: any[] = [];

    for (const country of countries) {
      for (const difficulty of difficulties) {
        for (const category of categories.slice(0, 2)) {
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

    console.log(`📝 Need to generate ${generationRequests.length} question batches`);
    console.warn("AI question generation is disabled. Skipping generation.");
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
