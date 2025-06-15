
```typescript
import { useState, useEffect } from "react";
import { GameOrchestrator, ProductionStatus } from "@/services/production/gameOrchestrator";
import { AutomatedAuditService, QualityReport } from "@/services/quality/automatedAudit";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/production/dashboard/Header";
import { StatusCards } from "@/components/production/dashboard/StatusCards";
import { IssuesAlert } from "@/components/production/dashboard/IssuesAlert";
import { QualityMetrics } from "@/components/production/dashboard/QualityMetrics";
import { ActionPanel } from "@/components/production/dashboard/ActionPanel";
import { CountryBreakdown } from "@/components/production/dashboard/CountryBreakdown";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductionDashboard() {
  const [status, setStatus] = useState<ProductionStatus | null>(null);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [orchestrator] = useState(() => GameOrchestrator.getInstance());
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    if (!status) setIsLoading(true);
    try {
      const [statusData, auditData] = await Promise.all([
        orchestrator.getProductionStatus(),
        AutomatedAuditService.runFullAudit()
      ]);
      setStatus(statusData);
      setQualityReport(auditData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSystem = async () => {
    setIsInitializing(true);
    try {
      await orchestrator.initialize();
      toast({
        title: "System Initialized",
        description: "Production system is now running.",
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to initialize system:', error);
      toast({
        title: "Initialization Failed",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const triggerFullRegeneration = async () => {
    if (!confirm('This will regenerate ALL questions. This may take several minutes. Continue?')) return;
    setIsLoading(true);
    try {
      await orchestrator.ensureFullCoverage();
      toast({
        title: "Regeneration Complete",
        description: "All questions have been regenerated.",
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to regenerate questions:', error);
      toast({
        title: "Regeneration Failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const DashboardSkeleton = () => (
    <div className="space-y-8">
      <Skeleton className="h-16 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          isLoading={isLoading && !status}
          isInitializing={isInitializing}
          onRefresh={loadDashboardData}
          onInitialize={initializeSystem}
        />
        {isLoading && !status ? (
          <DashboardSkeleton />
        ) : (
          <>
            {status && <StatusCards status={status} />}
            {status && <IssuesAlert status={status} />}
            {qualityReport && <QualityMetrics report={qualityReport} />}
            {status && (
              <ActionPanel 
                status={status}
                isLoading={isLoading}
                onRegenerate={triggerFullRegeneration}
                onAudit={loadDashboardData}
              />
            )}
            {qualityReport && <CountryBreakdown report={qualityReport} />}
          </>
        )}
      </div>
    </div>
  );
}
```
