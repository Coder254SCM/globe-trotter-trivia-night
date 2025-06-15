
```tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QualityReport } from "@/services/quality/automatedAudit";

interface CountryBreakdownProps {
  report: QualityReport;
}

const getQualityColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
};

export const CountryBreakdown = ({ report }: CountryBreakdownProps) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">Country Quality Status</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {report.detailedResults.slice(0, 12).map((country) => (
        <div key={country.countryId} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{country.countryName}</h4>
            <Badge 
              variant={
                country.status === 'excellent' ? 'default' :
                country.status === 'good' ? 'secondary' :
                'destructive'
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
    
    {report.detailedResults.length > 12 && (
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Showing top 12 countries. {report.detailedResults.length - 12} more available.
      </p>
    )}
  </Card>
);
```
