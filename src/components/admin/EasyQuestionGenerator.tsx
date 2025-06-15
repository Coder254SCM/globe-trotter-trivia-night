import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Globe, Zap, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { QuestionService } from "@/services/supabase/questionService";
import { QuestionValidationService } from "@/services/supabase/questionValidationService";
import countries from "@/data/countries";

interface QuestionTemplate {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  category: string;
  difficulty: 'easy';
  country_id: string;
}

export const EasyQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<'single' | 'all'>('single');
  const [stats, setStats] = useState({
    questionsGenerated: 0,
    questionsValidated: 0,
    questionsSaved: 0,
    validationErrors: 0,
    countriesProcessed: 0,
    currentCountry: '',
    timeElapsed: 0
  });

  // This function is now hardened to only generate questions with valid, existing data.
  // It avoids placeholders and generic content entirely.
  const generateEasyQuestions = async (country: any): Promise<QuestionTemplate[]> => {
    const questions: QuestionTemplate[] = [];
    const incorrectCapitals = ['Paris', 'London', 'Tokyo', 'New York', 'Beijing', 'Moscow'];
    const incorrectContinents = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];

    // --- Template 1: Capital City (only if capital exists and is valid) ---
    if (country.capital && country.capital !== 'N/A' && country.capital.length > 1) {
      const options = [
        country.capital,
        ...incorrectCapitals.filter(c => c !== country.capital && c !== country.name).slice(0, 3)
      ].sort(() => Math.random() - 0.5);

      if (options.length === 4) { // Ensure we have 4 distinct options
        const capitalQuestion: QuestionTemplate = {
          text: `What is the capital city of ${country.name}?`,
          option_a: options[0],
          option_b: options[1],
          option_c: options[2],
          option_d: options[3],
          correct_answer: country.capital,
          category: 'Geography',
          difficulty: 'easy',
          country_id: country.id,
        };
        questions.push(capitalQuestion);
      }
    }

    // --- Template 2: Continent (always available) ---
    const continentOptions = [
      country.continent,
      ...incorrectContinents.filter(c => c !== country.continent).slice(0, 3)
    ].sort(() => Math.random() - 0.5);

    if (continentOptions.length === 4) {
      const continentQuestion: QuestionTemplate = {
        text: `Which continent is ${country.name} located in?`,
        option_a: continentOptions[0],
        option_b: continentOptions[1],
        option_c: continentOptions[2],
        option_d: continentOptions[3],
        correct_answer: country.continent,
        category: 'Geography',
        difficulty: 'easy',
        country_id: country.id,
      };
      questions.push(continentQuestion);
    }
    
    // --- Final Validation Step ---
    const validatedQuestions: QuestionTemplate[] = [];
    for (const q of questions) {
      const validation = await QuestionValidationService.preValidateQuestion(q);
      if (validation.isValid) {
        validatedQuestions.push(q);
      } else {
        console.warn(`Generated question for ${country.name} failed validation: ${validation.issues.join(', ')}`);
      }
    }

    return validatedQuestions;
  };

  const handleGenerateQuestions = async () => {
    if (generationMode === 'single' && !selectedCountry) {
      toast.error('Please select a country first');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();
    
    // Reset stats for new generation run
    setStats({
      questionsGenerated: 0,
      questionsValidated: 0,
      questionsSaved: 0,
      validationErrors: 0,
      countriesProcessed: 0,
      currentCountry: '',
      timeElapsed: 0
    });
    
    try {
      const countriesToProcess = generationMode === 'all' 
        ? countries 
        : countries.filter(c => c.id === selectedCountry);

      let totalGenerated = 0;
      let totalValidated = 0;
      let totalSaved = 0;
      let totalErrors = 0;
      let countriesProcessed = 0;

      for (const country of countriesToProcess) {
        setStats(prev => ({ ...prev, currentCountry: country.name }));
        countriesProcessed++;

        try {
          const questions = await generateEasyQuestions(country);
          totalGenerated += questions.length;

          const validationResult = await QuestionValidationService.batchValidateQuestions(questions);
          totalValidated += validationResult.validQuestions;
          totalErrors += validationResult.criticalIssues;

          const validQuestions = validationResult.results
            .filter(r => r.isValid)
            .map((r, index) => ({
              ...questions[r.questionIndex],
              id: `${country.id}_easy_${index}_${Date.now()}`
            }));

          if (validQuestions.length > 0) {
            await QuestionService.saveQuestions(validQuestions);
            totalSaved += validQuestions.length;
          }

          setStats(prev => ({
            ...prev,
            questionsGenerated: totalGenerated,
            questionsValidated: totalValidated,
            questionsSaved: totalSaved,
            validationErrors: totalErrors,
            countriesProcessed: countriesProcessed,
            timeElapsed: Math.floor((Date.now() - startTime) / 1000)
          }));

        } catch (error) {
          console.error(`Error processing ${country.name}:`, error);
          totalErrors++;
        }
      }

      toast.success(`Generated ${totalSaved} easy questions successfully!`);
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = generationMode === 'all' && countries.length > 0
    ? (stats.countriesProcessed / countries.length) * 100 
    : (isGenerating ? 100 : 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-green-500" />
            Easy Question Generator
          </CardTitle>
          <CardDescription>
            Generate beginner-friendly questions with foolproof validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={generationMode} onValueChange={(value) => setGenerationMode(value as 'single' | 'all')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Country</TabsTrigger>
              <TabsTrigger value="all">All Countries</TabsTrigger>
            </TabsList>
            
            <TabsContent value="single" className="space-y-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
            
            <TabsContent value="all">
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Generate easy questions for all {countries.length} countries.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={handleGenerateQuestions}
            disabled={isGenerating || (generationMode === 'single' && !selectedCountry)}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Easy Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.questionsGenerated}</div>
                <div className="text-sm text-muted-foreground">Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.questionsValidated}</div>
                <div className="text-sm text-muted-foreground">Validated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.questionsSaved}</div>
                <div className="text-sm text-muted-foreground">Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.validationErrors}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>
            
            {stats.currentCountry && (
              <div className="text-center text-sm text-muted-foreground">
                Currently processing: <Badge variant="outline">{stats.currentCountry}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
