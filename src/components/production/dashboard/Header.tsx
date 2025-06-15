
import { Button } from "@/components/ui/button";
import { Target, RefreshCw, Play } from "lucide-react";

interface HeaderProps {
  isLoading: boolean;
  isInitializing: boolean;
  onRefresh: () => void;
  onInitialize: () => void;
}

export const DashboardHeader = ({ isLoading, isInitializing, onRefresh, onInitialize }: HeaderProps) => (
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
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          onClick={onInitialize}
          disabled={isInitializing}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isInitializing ? 'Initializing...' : 'Initialize System'}
        </Button>
      </div>
    </div>
  </div>
);
