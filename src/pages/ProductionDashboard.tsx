
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GameOrchestrator, ProductionStatus } from "@/services/production/gameOrchestrator";
import { AutomatedAuditService, QualityReport } from "@/services/quality/automatedAudit";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  Pause, 
  RefreshCw, 
  Settings,
  BarChart3,
  Globe,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductionDashboard() {
  const [status, setStatus] = useState<ProductionStatus | null>(null);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [orchestrator] = useState(() => GameOrchestrator.getInstance());
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
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
        description: "Production system is now running with automated quality assurance",
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to initialize system:', error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize production system",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const triggerFullRegeneration = async () => {
    if (!confirm('This will regenerate ALL questions. This may take several minutes. Continue?')) {
      return;
    }

    setIsLoading(true);
    try {
      await orchestrator.ensureFullCoverage();
      toast({
        title: "Regeneration Complete",
        description: "All questions have been regenerated with quality assurance",
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to regenerate questions:', error);
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (isReady: boolean) => {
    return isReady ? (
      <CheckCircle className="h-8 w-8 text-green-600" />
    ) : (
      <XCircle className="h-8 w-8 text-red-600" />
    );
  };

  const getQualityColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                Production Control Center
              </h1>
              <p className="text-muted-foreground mt-2">
                Automated quality assurance and question management system
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={loadDashboardData}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={initializeSystem}
                disabled={isInitializing}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isInitializing ? 'Initializing...' : 'Initialize System'}
              </Button>
            </div>
          </div>
        </div>

        {/* System Status Overview */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold">
                    {status.isReady ? 'Ready' : 'Not Ready'}
                  </p>
                </div>
                {getStatusIcon(status.isReady)}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quality Score</p>
                  <p className={`text-2xl font-bold ${getQualityColor(status.overallQuality)}`}>
                    {status.overallQuality.toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Country Coverage</p>
                  <p className="text-2xl font-bold">{status.countryCoverage.toFixed(1)}%</p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{status.totalQuestions.toLocaleString()}</p>
                </div>
                <Settings className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>
        )}

        {/* Critical Issues Alert */}
        {status?.criticalIssues && status.criticalIssues.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Critical Issues Detected:</strong>
              <ul className="mt-2 space-y-1">
                {status.criticalIssues.map((issue, index) => (
                  <li key={index} className="text-sm">• {issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Quality Report */}
        {qualityReport && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Overall Quality</span>
                    <Badge variant={qualityReport.overallScore >= 95 ? "default" : "destructive"}>
                      {qualityReport.overallScore.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={qualityReport.overallScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valid Questions</p>
                    <p className="font-semibold text-green-600">{qualityReport.validQuestions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Invalid Questions</p>
                    <p className="font-semibold text-red-600">{qualityReport.invalidQuestions}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Difficulty Distribution</h3>
              <div className="space-y-3">
                {Object.entries(qualityReport.difficultyDistribution).map(([difficulty, count]) => (
                  <div key={difficulty} className="flex justify-between items-center">
                    <span className="capitalize">{difficulty}</span>
                    <Badge variant="outline">{count.toLocaleString()}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Action Items */}
        {status?.actions && status.actions.length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
            <div className="space-y-2">
              {status.actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={triggerFullRegeneration}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerate All Questions
              </Button>
              <Button 
                variant="outline"
                onClick={loadDashboardData}
                disabled={isLoading}
              >
                Run Quality Audit
              </Button>
            </div>
          </Card>
        )}

        {/* Country Quality Breakdown */}
        {qualityReport && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Country Quality Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualityReport.detailedResults.slice(0, 12).map((country) => (
                <div key={country.countryId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{country.countryName}</h4>
                    <Badge 
                      variant={
                        country.status === 'excellent' ? 'default' :
                        country.status === 'good' ? 'secondary' :
                        country.status === 'poor' ? 'outline' : 'destructive'
                      }
                    >
                      {country.status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>{country.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <span className={getQualityColor(country.qualityScore)}>
                        {country.qualityScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {qualityReport.detailedResults.length > 12 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing top 12 countries. {qualityReport.detailedResults.length - 12} more available.
              </p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
