import { AutomatedAuditService, QualityReport } from "../quality/automatedAudit";
import { ProductionConfigService, ProductionConfig } from "./orchestrator/config";
import { ProductionStatusService, ProductionStatus } from "./orchestrator/status";
import { QuestionMaintenanceService } from "./orchestrator/maintenance";

export { ProductionStatus };

export class GameOrchestrator {
  private static instance: GameOrchestrator;
  private configService: ProductionConfigService;
  private statusService: ProductionStatusService;
  private maintenanceService: QuestionMaintenanceService;
  private isRunning: boolean = false;
  private lastAudit: QualityReport | null = null;
  private auditInterval: number | null = null;

  private constructor() {
    this.configService = new ProductionConfigService();
    const config = this.configService.getConfig();
    this.statusService = new ProductionStatusService(config);
    this.maintenanceService = new QuestionMaintenanceService(config);
  }

  static getInstance(): GameOrchestrator {
    if (!GameOrchestrator.instance) {
      GameOrchestrator.instance = new GameOrchestrator();
    }
    return GameOrchestrator.instance;
  }

  async initialize(): Promise<void> {
    console.log("🚀 Initializing production game system...");
    if (this.isRunning) {
      console.log("System already running");
      return;
    }

    try {
      this.lastAudit = await AutomatedAuditService.runFullAudit();
      const config = this.configService.getConfig();
      if (config.autoCleanup) await this.maintenanceService.performCleanup();
      if (config.autoGeneration) await this.maintenanceService.ensureFullCoverage();
      this.startAutomatedMonitoring();
      this.isRunning = true;
      console.log("✅ Production system initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize production system:", error);
      throw error;
    }
  }

  async getProductionStatus(): Promise<ProductionStatus> {
    return this.statusService.getProductionStatus(this.lastAudit);
  }

  async ensureFullCoverage(): Promise<void> {
    return this.maintenanceService.ensureFullCoverage();
  }

  private startAutomatedMonitoring(): void {
    if (this.auditInterval) clearInterval(this.auditInterval);
    
    console.log("🔄 Starting automated monitoring...");
    const config = this.configService.getConfig();
    
    this.auditInterval = setInterval(async () => {
      try {
        console.log("⏰ Running scheduled audit...");
        this.lastAudit = await AutomatedAuditService.runFullAudit();
        if (this.lastAudit.overallScore < config.qualityThreshold) {
          console.log("🚨 Quality dropped, triggering auto-fix...");
          await this.maintenanceService.performCleanup();
          await this.maintenanceService.ensureFullCoverage();
        }
      } catch (error) {
        console.error("Scheduled audit failed:", error);
      }
    }, config.auditIntervalHours * 60 * 60 * 1000);

    console.log(`📅 Scheduled audits every ${config.auditIntervalHours} hours`);
  }

  async regenerateCountryQuestions(countryIds: string[]): Promise<void> {
    return this.maintenanceService.regenerateCountryQuestions(countryIds);
  }

  getConfig(): ProductionConfig {
    return this.configService.getConfig();
  }

  updateConfig(newConfig: Partial<ProductionConfig>): void {
    this.configService.updateConfig(newConfig);
    const config = this.configService.getConfig();
    this.statusService = new ProductionStatusService(config);
    this.maintenanceService = new QuestionMaintenanceService(config);
    this.startAutomatedMonitoring();
    console.log("⚙️ System configuration updated and services re-initialized.");
  }

  stop(): void {
    this.isRunning = false;
    if (this.auditInterval) {
      clearInterval(this.auditInterval);
      this.auditInterval = null;
    }
    console.log("🛑 Production system stopped");
  }
}
