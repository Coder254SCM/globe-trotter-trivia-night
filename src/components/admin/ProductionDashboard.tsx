import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "../ui/progress";
import { 
  Database, 
  Zap, 
  CheckCircle, 
  Globe, 
  FileText,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { QuizService } from "@/services/supabase/quizService";
import { HardQuestionGenerator } from "../../scripts/generateHardQuestions";

export const ProductionDashboard = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [isGeneratingHard, setIsGeneratingHard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      const initialStats = await QuizService.getDatabaseStats();
      setStats(initialStats);
    };

    fetchStats();
  }, []);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitProgress(0);

    try {
      toast({
        title: "Database Initialization Started",
        description: "Populating countries and generating initial questions...",
      });

      const interval = setInterval(() => {
        setInitProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 3000);

      await QuizService.initializeProductionDatabase();
      clearInterval(interval);
      setInitProgress(100);

      toast({
        title: "Database Initialized!",
        description: "Successfully populated countries and generated initial questions.",
      });

      const newStats = await QuizService.getDatabaseStats();
      setStats(newStats);
    } catch (error) {
      console.error("Failed to initialize database:", error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize the database. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleGenerateHardQuestions = async () => {
    setIsGeneratingHard(true);
    
    try {
      toast({
        title: "PhD Question Generation Started",
        description: "Generating 50 hard questions for each country...",
      });

      await HardQuestionGenerator.generateForAllCountries();
      
      toast({
        title: "Hard Questions Generated!",
        description: "Successfully generated PhD-level questions for all countries.",
      });

      // Refresh stats
      const newStats = await QuizService.getDatabaseStats();
      setStats(newStats);

    } catch (error) {
      console.error('Failed to generate hard questions:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate hard questions. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingHard(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Production Dashboard</h2>
          <p className="text-muted-foreground">
            Manage and initialize the production database
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Production Initialization</h3>
              <p className="text-sm text-muted-foreground">
                Populate all countries and generate initial questions
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Easy Questions</Badge>
              <Badge variant="outline">All Countries</Badge>
              <Badge variant="outline">Initial Setup</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              This process populates all 195 countries and generates a base set
              of easy questions for each.
            </p>
          </div>

          {isInitializing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Initializing database...</span>
                <span>{initProgress}%</span>
              </div>
              <Progress value={initProgress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleInitialize}
            disabled={isInitializing || isGeneratingHard}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isInitializing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Initializing Database...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Initialize Production Database
              </>
            )}
          </Button>
        </div>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-purple-200 bg-gradient-to-br from-purple-50 to-background">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold">PhD-Level Questions</h3>
                <p className="text-sm text-muted-foreground">Generate 50 hard academic questions per country</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">PhD Level</Badge>
                <Badge variant="outline">50/Country</Badge>
                <Badge variant="outline">Academic</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Creates highly specialized questions requiring doctoral-level expertise
              </p>
            </div>

            <Button 
              onClick={handleGenerateHardQuestions}
              disabled={isGeneratingHard || isInitializing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isGeneratingHard ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Generating PhD Questions...
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Generate Hard Questions
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {stats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Database Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.totalCountries}</div>
              <div className="text-sm text-muted-foreground">Total Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.countriesWithQuestions}</div>
              <div className="text-sm text-muted-foreground">Countries with Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-500">{stats.averageQuestionsPerCountry}</div>
              <div className="text-sm text-muted-foreground">Avg. Questions per Country</div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-2">Next Steps & Recommendations</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <span className="font-medium">Monitor Question Performance:</span>{" "}
            Track which questions are frequently failed and consider updating or
            removing them.
          </li>
          <li>
            <span className="font-medium">Expand Question Categories:</span>{" "}
            Add more diverse question categories to cover a wider range of topics.
          </li>
          <li>
            <span className="font-medium">Implement User Feedback:</span>{" "}
            Allow users to submit feedback on questions to improve quality.
          </li>
          <li>
            <span className="font-medium">Regularly Update Questions:</span>{" "}
            Keep questions up-to-date with current events and changing information.
          </li>
          <li>
            <span className="font-medium">Generate Medium/Hard Questions:</span>{" "}
            Use the AI question generator to create more challenging questions.
          </li>
        </ul>
      </Card>
    </div>
  );
};
