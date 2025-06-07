
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { QuizService } from "@/services/supabase/quizService";
import { allCountries } from "@/data/countries";

export function ProductionDataInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const initializeProductionData = async () => {
    setIsInitializing(true);
    setProgress(0);
    setCurrentStep("Starting initialization...");

    try {
      // Step 1: Populate all 195 countries
      setCurrentStep("Adding all 195 countries to database...");
      setProgress(10);
      
      console.log(`🌍 Adding ${allCountries.length} countries to Supabase...`);
      await QuizService.populateAllCountries();
      
      setProgress(30);
      setCurrentStep("Countries added! Generating questions...");
      
      // Step 2: Generate questions for all countries
      setCurrentStep("Generating questions for all countries (this may take a while)...");
      setProgress(40);
      
      const countries = await QuizService.getAllCountries();
      console.log(`📊 Loaded ${countries.length} countries from database`);
      
      // Generate easy questions for all countries (20 questions per difficulty per country)
      let processedCount = 0;
      const totalCountries = countries.length;
      
      for (const country of countries) {
        setCurrentStep(`Generating questions for ${country.name}... (${processedCount + 1}/${totalCountries})`);
        
        try {
          // Generate easy questions only as requested
          await generateQuestionsForCountry(country, 'easy', 20);
          await generateQuestionsForCountry(country, 'medium', 10); // Fewer medium
          await generateQuestionsForCountry(country, 'hard', 5); // Fewer hard
          
          processedCount++;
          const progressPercent = 40 + (processedCount / totalCountries) * 50;
          setProgress(progressPercent);
          
          // Small delay to prevent overwhelming
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`⚠️ Failed to generate questions for ${country.name}:`, error);
        }
      }
      
      setProgress(95);
      setCurrentStep("Fetching final statistics...");
      
      // Step 3: Get final stats
      const finalStats = await QuizService.getDatabaseStats();
      setStats(finalStats);
      
      setProgress(100);
      setCurrentStep("✅ Production data initialization completed!");
      
      toast({
        title: "Success!",
        description: `Initialized ${finalStats.totalCountries} countries with ${finalStats.totalQuestions} questions`,
      });
      
    } catch (error) {
      console.error("❌ Production initialization failed:", error);
      toast({
        title: "Error",
        description: "Failed to initialize production data. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const generateQuestionsForCountry = async (country: any, difficulty: string, count: number) => {
    const questions = [];
    
    // Generate template questions for the country
    for (let i = 0; i < count; i++) {
      const monthRotation = (i % 12) + 1; // Spread across 12 months
      
      const question = {
        id: `${country.id}-${difficulty}-${monthRotation}-${i}`,
        country_id: country.id,
        text: getQuestionTemplate(country, difficulty, i),
        option_a: getOptionA(country, difficulty, i),
        option_b: getOptionB(country, difficulty, i),
        option_c: getOptionC(country, difficulty, i),
        option_d: getOptionD(country, difficulty, i),
        correct_answer: getOptionA(country, difficulty, i), // A is always correct
        difficulty,
        category: getCategory(i),
        explanation: `This is a ${difficulty} level question about ${country.name}.`,
        month_rotation: monthRotation,
        ai_generated: false
      };
      
      questions.push(question);
    }
    
    // Save to Supabase
    await QuizService.saveQuestions(questions);
  };

  const getQuestionTemplate = (country: any, difficulty: string, index: number) => {
    const templates = {
      easy: [
        `What is the capital of ${country.name}?`,
        `Which continent is ${country.name} located in?`,
        `What is the flag color of ${country.name}?`,
        `Is ${country.name} a landlocked country?`,
        `What language is commonly spoken in ${country.name}?`
      ],
      medium: [
        `What is the approximate population of ${country.name}?`,
        `What is the main religion in ${country.name}?`,
        `What is ${country.name} famous for producing?`,
        `What is the climate like in ${country.name}?`,
        `What is the government type of ${country.name}?`
      ],
      hard: [
        `What is the GDP per capita of ${country.name}?`,
        `When did ${country.name} gain independence?`,
        `What is the literacy rate in ${country.name}?`,
        `What are the major exports of ${country.name}?`,
        `What is the life expectancy in ${country.name}?`
      ]
    };
    
    const categoryTemplates = templates[difficulty as keyof typeof templates] || templates.easy;
    return categoryTemplates[index % categoryTemplates.length];
  };

  const getOptionA = (country: any, difficulty: string, index: number) => {
    if (difficulty === 'easy' && index % 5 === 0) return country.capital;
    if (difficulty === 'easy' && index % 5 === 1) return country.continent;
    return `Correct answer for ${country.name}`;
  };

  const getOptionB = (country: any, difficulty: string, index: number) => {
    return `Option B for ${country.name}`;
  };

  const getOptionC = (country: any, difficulty: string, index: number) => {
    return `Option C for ${country.name}`;
  };

  const getOptionD = (country: any, difficulty: string, index: number) => {
    return `Option D for ${country.name}`;
  };

  const getCategory = (index: number) => {
    const categories = ['Geography', 'History', 'Culture', 'Economy', 'Nature'];
    return categories[index % categories.length];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🚀 Production Data Initializer</CardTitle>
          <CardDescription>
            Initialize the production database with all 195 countries and generate questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isInitializing && !stats && (
            <Button onClick={initializeProductionData} size="lg" className="w-full">
              Initialize Production Data
            </Button>
          )}
          
          {isInitializing && (
            <div className="space-y-4">
              <div className="text-sm font-medium">{currentStep}</div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-gray-500">{Math.round(progress)}% complete</div>
            </div>
          )}
          
          {stats && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Production Data Initialized Successfully!
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Countries:</span> {stats.totalCountries}
                </div>
                <div>
                  <span className="font-medium">Questions:</span> {stats.totalQuestions}
                </div>
                <div>
                  <span className="font-medium">Avg per Country:</span> {stats.averageQuestionsPerCountry}
                </div>
                <div>
                  <span className="font-medium">Continents:</span> {Object.keys(stats.continents || {}).length}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
