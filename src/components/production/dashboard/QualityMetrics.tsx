
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QualityReport } from "@/services/quality/automatedAudit";

interface QualityMetricsProps {
  report: QualityReport;
}

export const QualityMetrics = ({ report }: QualityMetricsProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Overall Quality</span>
            <Badge variant={report.overallScore >= 95 ? "default" : "destructive"}>
              {report.overallScore.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={report.overallScore} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Valid Questions</p>
            <p className="font-semibold text-green-600">{report.validQuestions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Invalid Questions</p>
            <p className="font-semibold text-red-600">{report.invalidQuestions.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Difficulty Distribution</h3>
      <div className="space-y-3">
        {Object.entries(report.difficultyDistribution).map(([difficulty, count]) => (
          <div key={difficulty} className="flex justify-between items-center">
            <span className="capitalize">{difficulty}</span>
            <Badge variant="outline">{count.toLocaleString()}</Badge>
          </div>
        ))}
      </div>
    </Card>
  </div>
);
