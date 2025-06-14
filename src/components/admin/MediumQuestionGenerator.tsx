
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CountryService } from "@/services/supabase/countryService";
import { MediumQuestionService } from "@/services/supabase/mediumQuestionService";
import { BookOpen, Zap } from "lucide-react";
import { GenerationSettings } from "./mediumQuestions/GenerationSettings";
import { GenerationProgress } from "./mediumQuestions/GenerationProgress";
import { CategoryInfo } from "./mediumQuestions/CategoryInfo";
import { CountryConverter } from "@/utils/countryConverter";

interface SimpleCountry {
  id: string;
  name: string;
  continent: string;
}

export const MediumQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [questionsPerCategory, setQuestionsPerCategory] = useState(15);
  const [generationMode, setGenerationMode] = useState<"single" | "all">("single");
  const [countries, setCountries] = useState<SimpleCountry[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>("");
  const { toast } = useToast();

  useState(() => {
    const loadCountries = async () => {
      try {
        const allCountries = await CountryService.getAllCountries();
        const simpleCountries: SimpleCountry[] = allCountries.map(country => ({
          id: country.id,
          name: country.name,
          continent: country.continent
        }));
        setCountries(simpleCountries);
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    };
    loadCountries();
  });

  const generateMediumQuestions = async () => {
    if (generationMode === "single" && !selectedCountry) {
      toast({
        title: "No Country Selected",
        description: "Please select a country to generate questions for.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentCountry("");

    try {
      if (generationMode === "all") {
        const allCountries = await CountryService.getAllCountries();
        const totalCountries = allCountries.length;

        for (let i = 0; i < allCountries.length; i++) {
          const country = allCountries[i];
          setCurrentCountry(country.name);
          setProgress((i / totalCountries) * 100);

          // Convert to service type before passing to service
          const serviceCountry = CountryConverter.toServiceCountry(country);
          await MediumQuestionService.generateMediumQuestionsForCountry(
            serviceCountry, 
            questionsPerCategory
          );

          await new Promise(resolve => setTimeout(resolve, 100));
        }

        setProgress(100);
        toast({
          title: "Success!",
          description: `Generated medium questions for all ${totalCountries} countries!`,
        });
      } else {
        const fullCountries = await CountryService.getAllCountries();
        const country = fullCountries.find(c => c.id === selectedCountry);
        
        if (country) {
          setCurrentCountry(country.name);
          setProgress(50);

          // Convert to service type before passing to service
          const serviceCountry = CountryConverter.toServiceCountry(country);
          await MediumQuestionService.generateMediumQuestionsForCountry(
            serviceCountry, 
            questionsPerCategory
          );

          setProgress(100);
          toast({
            title: "Success!",
            description: `Generated ${questionsPerCategory * 5} medium questions for ${country.name}!`,
          });
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setCurrentCountry("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Medium Question Generator
          </CardTitle>
          <CardDescription>
            Generate medium-difficulty questions that require specific knowledge about countries.
            These questions go beyond basic facts and test deeper understanding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <GenerationSettings
            generationMode={generationMode}
            onGenerationModeChange={setGenerationMode}
            selectedCountry={selectedCountry}
            onSelectedCountryChange={setSelectedCountry}
            questionsPerCategory={questionsPerCategory}
            onQuestionsPerCategoryChange={setQuestionsPerCategory}
            countries={countries}
          />

          <GenerationProgress
            isGenerating={isGenerating}
            progress={progress}
            currentCountry={currentCountry}
          />

          <Button 
            onClick={generateMediumQuestions}
            disabled={isGenerating}
            className="w-full"
          >
            <Zap className="mr-2 h-4 w-4" />
            Generate Medium Questions
          </Button>
        </CardContent>
      </Card>

      <CategoryInfo />
    </div>
  );
};
