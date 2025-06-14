
import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Brain, Zap } from "lucide-react";
import { GenerationProgress } from "./GenerationProgress";

interface AllCountriesCardProps {
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  progress: number;
  currentCountry: string;
}

export const AllCountriesCard = ({ onGenerate, isGenerating, progress, currentCountry }: AllCountriesCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Generate All Countries</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate 30 manually crafted PhD-level questions for all 195 countries. These questions are written by expert knowledge across 30 academic categories.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">PhD Level</Badge>
            <Badge variant="outline">30 Questions/Country</Badge>
            <Badge variant="outline">Manual Craft</Badge>
          </div>
          
          <GenerationProgress 
            progress={progress}
            currentCountry={!currentCountry ? undefined : currentCountry}
            isGenerating={isGenerating && !currentCountry}
          />
          
          <Button 
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating && !currentCountry ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Generating All Countries...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate for All Countries
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
