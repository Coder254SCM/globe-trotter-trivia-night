
export interface ProductionConfig {
  minQuestionsPerDifficulty: number;
  qualityThreshold: number;
  auditIntervalHours: number;
  generationBatchSize: number;
  autoCleanup: boolean;
  autoGeneration: boolean;
}

export class ProductionConfigService {
  private config: ProductionConfig;

  constructor() {
    this.config = {
      minQuestionsPerDifficulty: 10,
      qualityThreshold: 95,
      auditIntervalHours: 6,
      generationBatchSize: 5,
      autoCleanup: true,
      autoGeneration: true
    };
  }

  getConfig(): ProductionConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<ProductionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log("⚙️ Updated system configuration:", newConfig);
  }
}
