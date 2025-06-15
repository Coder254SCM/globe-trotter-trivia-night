
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductionStatus } from "@/services/production/gameOrchestrator";
import { AlertTriangle } from "lucide-react";

interface IssuesAlertProps {
  status: ProductionStatus;
}

export const IssuesAlert = ({ status }: IssuesAlertProps) => {
  if (!status.criticalIssues || status.criticalIssues.length === 0) {
    return null;
  }
  
  return (
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
  );
};
