
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Eye, EyeOff, Trophy, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface GlobeHeaderProps {
  onToggleLabels: () => void;
  onStartWeeklyChallenge?: () => void;
  showLabels: boolean;
}

export const GlobeHeader = ({ 
  onToggleLabels, 
  onStartWeeklyChallenge, 
  showLabels 
}: GlobeHeaderProps) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/20">
            <Globe className="text-primary" size={24} />
            <div>
              <h1 className="text-xl font-bold text-foreground">Global Night Out</h1>
              <p className="text-xs text-muted-foreground">Interactive World Quiz Explorer</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            v2.0 Production Ready
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLabels}
            className="flex items-center gap-2 bg-background/90 backdrop-blur-sm"
          >
            {showLabels ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">
              {showLabels ? "Hide Labels" : "Show Labels"}
            </span>
          </Button>

          {onStartWeeklyChallenge && (
            <Button
              variant="default"
              size="sm"
              onClick={onStartWeeklyChallenge}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
            >
              <Trophy size={16} />
              <span className="hidden sm:inline">Weekly Challenge</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="bg-background/90 backdrop-blur-sm"
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
