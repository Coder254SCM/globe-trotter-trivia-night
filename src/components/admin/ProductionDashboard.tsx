
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Globe, 
  Trophy, 
  Users, 
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { getDynamicQuestionStats } from "../../utils/quiz/dynamicQuestionFetcher";
import { initializeSupabaseData } from "../../utils/quiz/supabaseQuestionFetcher";

export const ProductionDashboard = () => {
  const [stats, setStats] = useState({
    totalCountries: 195,
    countriesWithQuestions: 0,
    totalQuestions: 0,
    averageQuestionsPerCountry: 0
  });
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDynamicQuestionStats();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  const handleInitializeData = async () => {
    setInitializing(true);
    try {
      await initializeSupabaseData();
      await loadStats();
      alert('Production database initialized successfully!');
    } catch (error) {
      console.error('Error initializing:', error);
      alert('Error initializing database. Check console for details.');
    }
    setInitializing(false);
  };

  const completionPercentage = (stats.countriesWithQuestions / stats.totalCountries) * 100;
  const questionsPerCountry = stats.totalQuestions / (stats.countriesWithQuestions || 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Production Quiz System</h2>
          <p className="text-muted-foreground">
            Supabase-powered quiz database with all 195 countries
          </p>
        </div>
        <Button 
          onClick={handleInitializeData}
          disabled={initializing}
          size="lg"
        >
          {initializing ? "Initializing..." : "Initialize Production Data"}
        </Button>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Countries</p>
                <p className="text-3xl font-bold">{stats.totalCountries}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
            <Badge variant="outline" className="mt-2">
              All UN Countries
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Countries</p>
                <p className="text-3xl font-bold">{stats.countriesWithQuestions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <Badge variant="outline" className="mt-2">
              With Questions
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                <p className="text-3xl font-bold">{stats.totalQuestions.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <Badge variant="outline" className="mt-2">
              Production Ready
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg/Country</p>
                <p className="text-3xl font-bold">{Math.round(questionsPerCountry)}</p>
              </div>
              <Database className="h-8 w-8 text-orange-500" />
            </div>
            <Badge variant="outline" className="mt-2">
              Per Country
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Completion Status</CardTitle>
          <CardDescription>
            Progress towards full production deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Countries with Questions</span>
                <span className="text-sm text-muted-foreground">
                  {stats.countriesWithQuestions} / {stats.totalCountries}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Supabase Database</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Authentication System</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Competition Features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Ultimate Quiz</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Leaderboards</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">AI Question Generation</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Competition Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Individual competitions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Group competitions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Global leaderboards
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Weekly challenges
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ultimate Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Failed question tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Mastery system
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Progress analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Spaced repetition
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
