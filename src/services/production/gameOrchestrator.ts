import { QuestionGeneratorService, GenerationRequest } from "../ai/questionGenerator";
import { AutomatedAuditService, QualityReport } from "../quality/automatedAudit";
import { supabase } from "@/integrations/supabase/client";
import countries from "@/data/countries";

export interface ProductionConfig {
  minQuestionsPerDifficulty: number;
  qualityThreshold: number;
  auditIntervalHours: number;
  generationBatchSize: number;
  autoCleanup: boolean;
  autoGeneration: boolean;
}

export interface ProductionStatus {
  isReady: boolean;
  overallQuality: number;
  countryCoverage: number;
  totalQuestions: number;
  lastAudit: Date;
  nextScheduledAudit: Date;
  criticalIssues: string[];
  actions: string[];
}

export class GameOrchestrator {
  private static instance: GameOrchestrator;
  private config: ProductionConfig;
  private isRunning: boolean = false;
  private lastAudit: QualityReport | null = null;

  private constructor() {
    this.config = {
      minQuestionsPerDifficulty: 10,
      qualityThreshold: 95,
      auditIntervalHours: 6,
      generationBatchSize: 5,
      autoCleanup: true,
      autoGeneration: true
    };
  }

  static getInstance(): GameOrchestrator {
    if (!GameOrchestrator.instance) {
      GameOrchestrator.instance = new GameOrchestrator();
    }
    return GameOrchestrator.instance;
  }

  /**
   * Initialize production-ready system
   */
  async initialize(): Promise<void> {
    console.log("🚀 Initializing production game system...");
    
    if (this.isRunning) {
      console.log("System already running");
      return;
    }

    try {
      // Step 1: Run initial audit
      console.log("📊 Running initial quality audit...");
      this.lastAudit = await AutomatedAuditService.runFullAudit();
      
      // Step 2: Clean up existing issues
      if (this.config.autoCleanup) {
        await this.performCleanup();
      }

      // Step 3: Fill coverage gaps
      if (this.config.autoGeneration) {
        await this.ensureFullCoverage();
      }

      // Step 4: Start automated monitoring
      this.startAutomatedMonitoring();
      
      this.isRunning = true;
      console.log("✅ Production system initialized successfully");
      
    } catch (error) {
      console.error("❌ Failed to initialize production system:", error);
      throw error;
    }
  }

  /**
   * Get current production status
   */
  async getProductionStatus(): Promise<ProductionStatus> {
    const currentAudit = this.lastAudit || await AutomatedAuditService.runFullAudit();
    
    const isReady = currentAudit.overallScore >= this.config.qualityThreshold &&
                   currentAudit.countryCoverage >= 95;

    const actions: string[] = [];
    
    if (currentAudit.overallScore < this.config.qualityThreshold) {
      actions.push(`Improve quality from ${currentAudit.overallScore.toFixed(1)}% to ${this.config.qualityThreshold}%`);
    }
    
    if (currentAudit.countryCoverage < 95) {
      actions.push(`Increase country coverage from ${currentAudit.countryCoverage.toFixed(1)}% to 95%`);
    }

    actions.push(...currentAudit.recommendations.slice(0, 3));

    return {
      isReady,
      overallQuality: currentAudit.overallScore,
      countryCoverage: currentAudit.countryCoverage,
      totalQuestions: currentAudit.totalQuestions,
      lastAudit: new Date(),
      nextScheduledAudit: new Date(Date.now() + this.config.auditIntervalHours * 60 * 60 * 1000),
      criticalIssues: currentAudit.criticalIssues,
      actions
    };
  }

  /**
   * Ensure full coverage across all countries and difficulties
   */
  async ensureFullCoverage(): Promise<void> {
    console.log("🌍 Ensuring full country and difficulty coverage...");
    
    const categories = ['Geography', 'Culture', 'History', 'Politics', 'Economy'];
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    const generationRequests: GenerationRequest[] = [];

    for (const country of countries) {
      for (const difficulty of difficulties) {
        for (const category of categories.slice(0, 2)) { // Start with top 2 categories
          // Check current question count
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

    // Process in batches to avoid overwhelming the system
    const batches = this.chunkArray(generationRequests, this.config.generationBatchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} requests)`);
      
      try {
        const results = await QuestionGeneratorService.batchGenerate(batch);
        await this.saveGeneratedQuestions(results);
        
        // Short delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Failed to process batch ${i + 1}:`, error);
      }
    }
  }

  /**
   * Save generated questions to database
   */
  private async saveGeneratedQuestions(results: Map<string, any[]>): Promise<void> {
    const allQuestions: any[] = [];
    
    for (const [key, questions] of results) {
      allQuestions.push(...questions);
    }

    if (allQuestions.length === 0) return;

    const { error } = await supabase
      .from('questions')
      .insert(allQuestions);

    if (error) {
      console.error("Failed to save generated questions:", error);
      throw error;
    }

    console.log(`💾 Saved ${allQuestions.length} new questions`);
  }

  /**
   * Perform automated cleanup
   */
  private async performCleanup(): Promise<void> {
    console.log("🧹 Performing automated cleanup...");
    
    // Remove questions with placeholder content
    const placeholderPatterns = [
      '%methodology%',
      '%approach%', 
      '%technique%',
      '%placeholder%',
      '%option a for%',
      '%option b for%',
      '%option c for%',
      '%option d for%'
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

  /**
   * Start automated monitoring and maintenance
   */
  private startAutomatedMonitoring(): void {
    console.log("🔄 Starting automated monitoring...");
    
    // Schedule regular audits
    setInterval(async () => {
      try {
        console.log("⏰ Running scheduled audit...");
        this.lastAudit = await AutomatedAuditService.runFullAudit();
        
        // Auto-fix issues if quality drops
        if (this.lastAudit.overallScore < this.config.qualityThreshold) {
          console.log("🚨 Quality dropped, triggering auto-fix...");
          await this.performCleanup();
          await this.ensureFullCoverage();
        }
        
      } catch (error) {
        console.error("Scheduled audit failed:", error);
      }
    }, this.config.auditIntervalHours * 60 * 60 * 1000);

    console.log(`📅 Scheduled audits every ${this.config.auditIntervalHours} hours`);
  }

  /**
   * Force regeneration for specific countries
   */
  async regenerateCountryQuestions(countryIds: string[]): Promise<void> {
    console.log(`🔄 Regenerating questions for ${countryIds.length} countries...`);
    
    const requests: GenerationRequest[] = [];
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const categories = ['Geography', 'Culture'];

    for (const countryId of countryIds) {
      // First, delete existing questions
      await supabase
        .from('questions')
        .delete()
        .eq('country_id', countryId);

      // Then generate new ones
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

    const results = await QuestionGeneratorService.batchGenerate(requests);
    await this.saveGeneratedQuestions(results);
    
    console.log(`✅ Regenerated questions for ${countryIds.length} countries`);
  }

  /**
   * Utility: Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get system configuration
   */
  getConfig(): ProductionConfig {
    return { ...this.config };
  }

  /**
   * Update system configuration
   */
  updateConfig(newConfig: Partial<ProductionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log("⚙️ Updated system configuration:", newConfig);
  }

  /**
   * Stop the system
   */
  stop(): void {
    this.isRunning = false;
    console.log("🛑 Production system stopped");
  }
}
