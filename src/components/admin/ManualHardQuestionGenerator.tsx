
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";
import { ManualHardQuestionGenerator } from "../../scripts/generateManualHardQuestions";
import { AllCountriesCard } from "./manualQuestions/AllCountriesCard";
import { SingleCountryCard } from "./manualQuestions/SingleCountryCard";
import { GenerationStats } from "./manualQuestions/GenerationStats";
import { CategoryInfo } from "./manualQuestions/CategoryInfo";

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
        description: "Generating 30 manually crafted hard questions for each country...",
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
        totalQuestions: "5,850",
        avgPerCountry: 30,
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
        description: `Generated 30 manually crafted PhD-level questions for ${countryName}!`,
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
          <p className="text-muted-foreground">Generate 30 manually crafted hard academic questions for each country</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AllCountriesCard
          onGenerate={handleGenerateAll}
          isGenerating={isGenerating}
          progress={progress}
          currentCountry={currentCountry}
        />

        <SingleCountryCard
          onGenerate={handleGenerateCountry}
          isGenerating={isGenerating}
          currentCountry={currentCountry}
        />
      </div>

      <GenerationStats stats={stats} />
      <CategoryInfo />
    </div>
  );
};
