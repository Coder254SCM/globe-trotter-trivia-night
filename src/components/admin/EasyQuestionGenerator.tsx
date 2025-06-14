
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CountryService } from "@/services/supabase/countryService";
import { QuestionService } from "@/services/supabase/questionService";
import { Loader2, BookOpen, Lightbulb } from "lucide-react";

export const EasyQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [questionsPerCategory, setQuestionsPerCategory] = useState(10);
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

  const generateEasyQuestions = async () => {
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

    try {
      if (generationMode === "all") {
        const allCountries = await CountryService.getAllCountries();
        const totalCountries = allCountries.length;

        for (let i = 0; i < allCountries.length; i++) {
          const country = allCountries[i];
          setCurrentCountry(country.name);
          setProgress((i / totalCountries) * 100);

          await generateEasyQuestionsForCountry(country, questionsPerCategory);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        setProgress(100);
        toast({
          title: "Success!",
          description: `Generated easy questions for all ${totalCountries} countries!`,
        });
      } else {
        const country = countries.find(c => c.id === selectedCountry);
        if (country) {
          setCurrentCountry(country.name);
          setProgress(50);
          await generateEasyQuestionsForCountry(country, questionsPerCategory);
          setProgress(100);
          toast({
            title: "Success!",
            description: `Generated ${questionsPerCategory * 3} easy questions for ${country.name}!`,
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

  const generateEasyQuestionsForCountry = async (country: any, questionsPerCategory: number) => {
    const categories = ['Geography', 'History', 'Culture'];
    const questions: any[] = [];
    
    for (const category of categories) {
      for (let i = 0; i < questionsPerCategory; i++) {
        const monthRotation = (i % 12) + 1;
        
        const question = {
          id: `${country.id}-easy-${category.toLowerCase()}-${monthRotation}-${i}`,
          country_id: country.id,
          text: getEasyQuestionTemplate(country, category, i),
          option_a: getEasyCorrectAnswer(country, category, i),
          option_b: `Incorrect option B for ${country.name}`,
          option_c: `Incorrect option C for ${country.name}`,
          option_d: `Incorrect option D for ${country.name}`,
          correct_answer: getEasyCorrectAnswer(country, category, i),
          difficulty: 'easy',
          category,
          explanation: `This is a basic ${category} question about ${country.name}.`,
          month_rotation: monthRotation,
          ai_generated: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image_url: null
        };
        
        questions.push(question);
      }
    }
    
    await QuestionService.saveQuestions(questions);
  };

  const getEasyQuestionTemplate = (country: any, category: string, index: number): string => {
    const templates = {
      Geography: [
        `What is the capital city of ${country.name}?`,
        `Which continent is ${country.name} located in?`,
        `What is the official language of ${country.name}?`,
        `Which ocean/sea borders ${country.name}?`,
        `What is the currency used in ${country.name}?`,
        `What is the approximate population of ${country.name}?`,
        `Which region of the world is ${country.name} in?`,
        `What is the main religion in ${country.name}?`,
        `What type of government does ${country.name} have?`,
        `What is ${country.name} famous for producing?`
      ],
      History: [
        `When did ${country.name} gain independence?`,
        `What year was ${country.name} founded/established?`,
        `Who was a famous leader of ${country.name}?`,
        `What major historical event happened in ${country.name}?`,
        `Which empire controlled ${country.name} in the past?`,
        `When did ${country.name} become a republic/kingdom?`,
        `What century was ${country.name} discovered/colonized?`,
        `Who were the original inhabitants of ${country.name}?`,
        `What was the former name of ${country.name}?`,
        `Which war significantly affected ${country.name}?`
      ],
      Culture: [
        `What is the traditional food of ${country.name}?`,
        `What is the national sport of ${country.name}?`,
        `What is a famous festival celebrated in ${country.name}?`,
        `What is the traditional dress of ${country.name} called?`,
        `What is ${country.name}'s national animal?`,
        `What is a famous landmark in ${country.name}?`,
        `What type of music is ${country.name} known for?`,
        `What is the greeting style in ${country.name}?`,
        `What is a popular dance from ${country.name}?`,
        `What is ${country.name}'s national flower?`
      ]
    };
    
    const categoryTemplates = templates[category as keyof typeof templates] || templates.Geography;
    return categoryTemplates[index % categoryTemplates.length];
  };

  const getEasyCorrectAnswer = (country: any, category: string, index: number): string => {
    if (category === 'Geography') {
      if (index % 3 === 0) return country.capital || `Capital of ${country.name}`;
      if (index % 3 === 1) return country.continent;
    }
    
    return `Correct answer for ${country.name} - ${category}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Easy Question Generator
          </CardTitle>
          <CardDescription>
            Generate basic, entry-level questions about countries. Perfect for beginners and quick learning.
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
                max="20"
                value={questionsPerCategory}
                onChange={(e) => setQuestionsPerCategory(parseInt(e.target.value) || 10)}
              />
              <p className="text-sm text-muted-foreground">
                Total questions: {questionsPerCategory * 3} (3 categories)
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
            onClick={generateEasyQuestions}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Generate Easy Questions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Easy Question Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Geography</h4>
              <p className="text-sm text-muted-foreground">
                Capital cities, continents, basic location facts, currencies
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">History</h4>
              <p className="text-sm text-muted-foreground">
                Independence dates, famous leaders, major historical events
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Culture</h4>
              <p className="text-sm text-muted-foreground">
                Traditional foods, national symbols, famous landmarks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
