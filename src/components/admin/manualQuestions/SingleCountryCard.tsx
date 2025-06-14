
import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { BookOpen, Zap } from "lucide-react";

interface SingleCountryCardProps {
  onGenerate: (countryName: string) => Promise<void>;
  isGenerating: boolean;
  currentCountry: string;
}

export const SingleCountryCard = ({ onGenerate, isGenerating, currentCountry }: SingleCountryCardProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleGenerate = () => {
    if (inputValue.trim()) {
      onGenerate(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Single Country</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate manually crafted PhD-level questions for a specific country. Enter the exact country name.
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter country name (e.g., France)"
            className="w-full px-3 py-2 border border-border rounded-md"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {currentCountry && (
            <div className="text-sm text-muted-foreground">
              Generating for: <span className="font-medium">{currentCountry}</span>
            </div>
          )}
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !inputValue.trim()}
            variant="outline"
            className="w-full"
          >
            {isGenerating && currentCountry ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Generate for Country
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
