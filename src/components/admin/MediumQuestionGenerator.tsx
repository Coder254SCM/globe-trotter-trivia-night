
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CountryService } from "@/services/supabase/countryService";
import { MediumQuestionService } from "@/services/supabase/mediumQuestionService";
import { Loader2, BookOpen, Globe, Zap } from "lucide-react";

export const MediumQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [questionsPerCategory, setQuestionsPerCategory] = useState(15);
  const [generationMode, setGenerationMode] = useState<"single" | "all">("single");
  const [countries, setCountries] = useState<any[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>("");
  const { toast } = useToast();

  useState(() => {
    const loadCountries = async () => {
      try {
        const allCountries = await CountryService.getAllCountries();
        setCountries(allCountries);
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

          await MediumQuestionService.generateMediumQuestionsForCountry(
            country, 
            questionsPerCategory
          );

          // Small delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        setProgress(100);
        toast({
          title: "Success!",
          description: `Generated medium questions for all ${totalCountries} countries!`,
        });
      } else {
        const country = countries.find(c => c.id === selectedCountry);
        if (country) {
          setCurrentCountry(country.name);
          setProgress(50);

          await MediumQuestionService.generateMediumQuestionsForCountry(
            country, 
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="generation-mode">Generation Mode</Label>
              <Select value={generationMode} onValueChange={(value: "single" | "all") => setGenerationMode(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select generation mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Country</SelectItem>
                  <SelectItem value="all">All Countries</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {generationMode === "single" && (
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="questions-per-category">Questions per Category</Label>
              <Input
                id="questions-per-category"
                type="number"
                min="5"
                max="30"
                value={questionsPerCategory}
                onChange={(e) => setQuestionsPerCategory(parseInt(e.target.value) || 15)}
              />
              <p className="text-sm text-muted-foreground">
                Total questions: {questionsPerCategory * 5} (5 categories)
              </p>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  {currentCountry ? `Generating for ${currentCountry}...` : "Starting generation..."}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={generateMediumQuestions}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Generate Medium Questions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medium Question Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Geography</h4>
              <p className="text-sm text-muted-foreground">
                Land area, population density, borders, climate zones, natural resources
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">History</h4>
              <p className="text-sm text-muted-foreground">
                Independence dates, colonial history, major wars, constitutions, treaties
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Culture</h4>
              <p className="text-sm text-muted-foreground">
                Traditional dress, languages, festivals, art forms, customs
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Economy</h4>
              <p className="text-sm text-muted-foreground">
                GDP, main industries, exports, trade agreements, economic indicators
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Politics</h4>
              <p className="text-sm text-muted-foreground">
                Government systems, political parties, international relations, rights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
