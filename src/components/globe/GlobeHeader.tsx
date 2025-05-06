
import React from "react";
import { GlobeIcon, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlobeHeaderProps {
  onToggleLabels: () => void;
  onStartWeeklyChallenge?: () => void;
  showLabels: boolean;
}

export const GlobeHeader: React.FC<GlobeHeaderProps> = ({ 
  onToggleLabels, 
  onStartWeeklyChallenge, 
  showLabels 
}) => {
  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-4xl font-bold flex items-center bg-background/80 backdrop-blur-sm p-2 rounded-lg">
          <GlobeIcon size={40} className="mr-2 text-primary glow" />
          <span>Global Night Out</span>
        </h1>
        <p className="text-muted-foreground mt-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg max-w-md">
          Explore the world and test your knowledge in this interactive trivia adventure
        </p>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          onClick={onToggleLabels}
          className="flex items-center gap-2 bg-background/90 backdrop-blur-sm"
          variant="outline"
        >
          <MapPin size={18} />
          {showLabels ? "Hide Labels" : "Show Labels"}
        </Button>
        
        {onStartWeeklyChallenge && (
          <Button 
            onClick={onStartWeeklyChallenge}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-md"
          >
            <Trophy size={18} />
            Weekly Challenge
          </Button>
        )}
      </div>
    </>
  );
};
