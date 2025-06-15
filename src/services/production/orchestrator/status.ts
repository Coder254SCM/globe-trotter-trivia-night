
```typescript
import { AutomatedAuditService, QualityReport } from "../../quality/automatedAudit";
import { ProductionConfig } from "./config";

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

export class ProductionStatusService {
  private config: ProductionConfig;

  constructor(config: ProductionConfig) {
    this.config = config;
  }
  
  public async getProductionStatus(lastAudit: QualityReport | null): Promise<ProductionStatus> {
    const currentAudit = lastAudit || await AutomatedAuditService.runFullAudit();
    
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
}
```
