import { Card } from "@/components/ui/card";
import { ProductionStatus } from "@/services/production/gameOrchestrator";
import { BarChart3, Globe, Settings, CheckCircle, XCircle } from "lucide-react";

interface StatusCardsProps {
  status: ProductionStatus;
}

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

export const StatusCards = ({ status }: StatusCardsProps) => (
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
);
