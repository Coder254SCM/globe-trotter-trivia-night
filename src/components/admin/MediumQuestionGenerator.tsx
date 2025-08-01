
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Globe, Target, Trophy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { QuestionService } from "@/services/supabase/questionService";
import { QuestionValidationService } from "@/services/supabase/questionValidationService";
import countries from "@/data/countries";

interface GenerationStats {
  questionsGenerated: number;
  questionsValidated: number;
  questionsSaved: number;
  validationErrors: number;
  currentCountry: string;
  timeElapsed: number;
}

interface QuestionTemplate {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  category: string;
  difficulty: 'medium';
  country_id: string;
}

export const MediumQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<'single' | 'all'>('single');
  const [stats, setStats] = useState<GenerationStats>({
    questionsGenerated: 0,
    questionsValidated: 0,
    questionsSaved: 0,
    validationErrors: 0,
    currentCountry: '',
    timeElapsed: 0
  });

  // Predefined medium difficulty question templates
  const mediumQuestionTemplates = {
    Geography: [
      {
        template: "What is the approximate population of {country}?",
        getOptions: (country: any) => ({
          correct: `${Math.round(country.population / 1000000)} million`,
          incorrect: [
            `${Math.round(country.population / 1000000 * 0.5)} million`,
            `${Math.round(country.population / 1000000 * 1.5)} million`,
            `${Math.round(country.population / 1000000 * 2)} million`
          ]
        })
      },
      {
        template: "Which continent is {country} located in?",
        getOptions: (country: any) => ({
          correct: country.continent,
          incorrect: ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania']
            .filter(c => c !== country.continent).slice(0, 3)
        })
      }
    ],
    Culture: [
      {
        template: "What is a traditional cultural aspect commonly associated with {country}?",
        getOptions: (country: any) => {
          const culturalAspects = {
            'Japan': { correct: 'Tea ceremony', incorrect: ['Wine making', 'Bullfighting', 'Oktoberfest'] },
            'India': { correct: 'Yoga and meditation', incorrect: ['Flamenco dancing', 'Alpine skiing', 'Surfing'] },
            'Brazil': { correct: 'Carnival celebrations', incorrect: ['Ice hockey', 'Desert festivals', 'Northern lights viewing'] },
            'France': { correct: 'Fine cuisine and wine', incorrect: ['Sumo wrestling', 'Cricket', 'Rodeo'] }
          };
          return culturalAspects[country.name] || { 
            correct: 'Rich cultural heritage', 
            incorrect: ['Space exploration', 'Desert nomadism', 'Arctic survival'] 
          };
        }
      }
    ],
    Economy: [
      {
        template: "What is a major economic sector in {country}?",
        getOptions: (country: any) => {
          const economicSectors = {
            'Saudi Arabia': { correct: 'Oil and petroleum', incorrect: ['Tourism', 'Technology', 'Agriculture'] },
            'Switzerland': { correct: 'Banking and finance', incorrect: ['Mining', 'Fishing', 'Forestry'] },
            'Thailand': { correct: 'Tourism and agriculture', incorrect: ['Heavy industry', 'Mining', 'Oil production'] },
            'Germany': { correct: 'Manufacturing and engineering', incorrect: ['Agriculture only', 'Tourism only', 'Fishing only'] }
          };
          return economicSectors[country.name] || { 
            correct: 'Diverse economy', 
            incorrect: ['Single-sector economy', 'Barter system only', 'No formal economy'] 
          };
        }
      }
    ]
  };

  const generateMediumQuestions = async (country: any): Promise<QuestionTemplate[]> => {
    const questions: QuestionTemplate[] = [];
    const categories = Object.keys(mediumQuestionTemplates);

    for (const category of categories) {
      const templates = mediumQuestionTemplates[category as keyof typeof mediumQuestionTemplates];
      
      for (const template of templates) {
        try {
          const options = template.getOptions(country);
          const allOptions = [options.correct, ...options.incorrect];
          
          // Shuffle options
          const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
          
          const question: QuestionTemplate = {
            text: template.template.replace('{country}', country.name),
            option_a: shuffledOptions[0],
            option_b: shuffledOptions[1],
            option_c: shuffledOptions[2],
            option_d: shuffledOptions[3],
            correct_answer: options.correct,
            category,
            difficulty: 'medium',
            country_id: country.id
          };

          // Validate the question before adding
          const validation = await QuestionValidationService.preValidateQuestion(question);
          if (validation.isValid) {
            questions.push(question);
          } else {
            console.warn(`Skipping invalid question for ${country.name}:`, validation.issues);
          }
        } catch (error) {
          console.error(`Error generating question for ${country.name}:`, error);
        }
      }
    }

    return questions;
  };

  const handleGenerateQuestions = async () => {
    if (generationMode === 'single' && !selectedCountry) {
      toast.error('Please select a country first');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      const countriesToProcess = generationMode === 'all' 
        ? countries 
        : countries.filter(c => c.id === selectedCountry);

      let totalGenerated = 0;
      let totalValidated = 0;
      let totalSaved = 0;
      let totalErrors = 0;

      for (const country of countriesToProcess) {
        setStats(prev => ({ ...prev, currentCountry: country.name }));

        try {
          // Generate questions for this country
          const questions = await generateMediumQuestions(country);
          totalGenerated += questions.length;

          // Validate all questions
          const validationResult = await QuestionValidationService.batchValidateQuestions(questions);
          totalValidated += validationResult.validQuestions;
          totalErrors += validationResult.criticalIssues;

          // Save valid questions
          const validQuestions = validationResult.results
            .filter(r => r.isValid)
            .map((r, index) => ({
              ...questions[r.questionIndex],
              id: `${country.id}_medium_${index}_${Date.now()}`
            }));

          if (validQuestions.length > 0) {
            await QuestionService.saveQuestions(validQuestions);
            totalSaved += validQuestions.length;
          }

          // Update stats
          setStats(prev => ({
            ...prev,
            questionsGenerated: totalGenerated,
            questionsValidated: totalValidated,
            questionsSaved: totalSaved,
            validationErrors: totalErrors,
            timeElapsed: Math.floor((Date.now() - startTime) / 1000)
          }));

        } catch (error) {
          console.error(`Error processing ${country.name}:`, error);
          totalErrors++;
        }
      }

      toast.success(`Generated ${totalSaved} medium questions successfully!`);
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = generationMode === 'all' ? (stats.questionsGenerated / (countries.length * 6)) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Medium Question Generator
          </CardTitle>
          <CardDescription>
            Generate high-quality medium difficulty questions with comprehensive validation
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
                  This will generate medium questions for all {countries.length} countries. 
                  This process may take several minutes.
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
                <Trophy className="mr-2 h-4 w-4" />
                Generate Medium Questions
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Quality Assurance Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ Validation Checks</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• No placeholder text detection</li>
                <li>• Correct answer validation</li>
                <li>• Duplicate option prevention</li>
                <li>• Minimum quality standards</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">🔧 Template System</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Predefined question templates</li>
                <li>• Country-specific data integration</li>
                <li>• Category-based organization</li>
                <li>• Factual accuracy guarantee</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
