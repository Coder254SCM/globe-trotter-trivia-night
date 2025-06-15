
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductionStatus } from "@/services/production/gameOrchestrator";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ActionPanelProps {
  status: ProductionStatus;
  isLoading: boolean;
  onRegenerate: () => void;
  onAudit: () => void;
}

export const ActionPanel = ({ status, isLoading, onRegenerate, onAudit }: ActionPanelProps) => {
  if (!status.actions || status.actions.length === 0) {
    return null;
  }
  
  return (
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
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate All Questions
        </Button>
        <Button 
          variant="outline"
          onClick={onAudit}
          disabled={isLoading}
        >
          Run Quality Audit
        </Button>
      </div>
    </Card>
  );
};
