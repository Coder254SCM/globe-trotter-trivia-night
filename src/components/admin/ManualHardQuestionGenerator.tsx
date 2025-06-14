
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { ManualHardQuestionGenerator } from "../../scripts/generateManualHardQuestions";
import { Brain, BookOpen, GraduationCap, Zap, FileText } from "lucide-react";

export const ManualHardQuestionGeneratorComponent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentCountry("");
    
    try {
      toast({
        title: "Manual PhD Question Generation Started",
        description: "Generating 50 manually crafted hard questions for each country...",
      });

      // Monitor progress (simplified - in real implementation you'd track actual progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 95));
      }, 1000);

      await ManualHardQuestionGenerator.generateForAllCountries();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Generation Complete!",
        description: "Successfully generated manually crafted PhD-level questions for all countries.",
      });

      // Update stats
      setStats({
        totalQuestions: "9,750",
        avgPerCountry: 50,
        difficulty: "PhD Level (Manual)"
      });

    } catch (error) {
      console.error('Failed to generate manual hard questions:', error);
      toast({
        title: "Generation Failed",
        description: "Some questions may have been generated. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setCurrentCountry("");
    }
  };

  const handleGenerateCountry = async (countryName: string) => {
    if (!countryName.trim()) {
      toast({
        title: "Country Required",
        description: "Please enter a country name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setCurrentCountry(countryName);
    
    try {
      await ManualHardQuestionGenerator.generateForCountry(countryName);
      
      toast({
        title: "Country Questions Generated",
        description: `Generated 50 manually crafted PhD-level questions for ${countryName}!`,
      });
    } catch (error) {
      console.error(`Failed to generate questions for ${countryName}:`, error);
      toast({
        title: "Generation Failed",
        description: `Failed to generate questions for ${countryName}.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setCurrentCountry("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Manual PhD-Level Question Generator</h2>
          <p className="text-muted-foreground">Generate 50 manually crafted hard academic questions for each country</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Generate All Countries</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate 50 manually crafted PhD-level questions for all 195 countries. These questions are written by expert knowledge across 10 academic categories.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">PhD Level</Badge>
                <Badge variant="outline">50 Questions/Country</Badge>
                <Badge variant="outline">Manual Craft</Badge>
              </div>
              {isGenerating && !currentCountry && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating questions...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              <Button 
                onClick={handleGenerateAll}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGenerateCountry((e.target as HTMLInputElement).value);
                  }
                }}
              />
              {currentCountry && (
                <div className="text-sm text-muted-foreground">
                  Generating for: <span className="font-medium">{currentCountry}</span>
                </div>
              )}
              <Button 
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  handleGenerateCountry(input?.value || '');
                }}
                disabled={isGenerating}
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
      </div>

      {stats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Generation Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.avgPerCountry}</div>
              <div className="text-sm text-muted-foreground">Per Country</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.difficulty}</div>
              <div className="text-sm text-muted-foreground">Difficulty Level</div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-2">Manual PhD-Level Question Categories</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <ul className="space-y-1">
            <li>• Constitutional Law (5 questions per country)</li>
            <li>• Economic Policy (5 questions per country)</li>
            <li>• Diplomatic History (5 questions per country)</li>
            <li>• Archaeological Research (5 questions per country)</li>
            <li>• Linguistic Studies (5 questions per country)</li>
          </ul>
          <ul className="space-y-1">
            <li>• Demographics (5 questions per country)</li>
            <li>• Legal Systems (5 questions per country)</li>
            <li>• Political Theory (5 questions per country)</li>
            <li>• Academic Research (5 questions per country)</li>
            <li>• Historical Analysis (5 questions per country)</li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          All questions are manually crafted to require doctoral-level expertise and cover specialized academic knowledge across multiple disciplines.
        </p>
      </Card>
    </div>
  );
};
