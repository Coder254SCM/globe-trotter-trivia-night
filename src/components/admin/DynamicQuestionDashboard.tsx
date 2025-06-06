
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Database, Globe, BookOpen } from "lucide-react";
import { getDynamicQuestionStats, getCountriesWithQuestions } from "../../utils/quiz/dynamicQuestionFetcher";
import countries from "../../data/countries";

export const DynamicQuestionDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [countriesWithQuestions, setCountriesWithQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [statsData, countriesData] = await Promise.all([
        getDynamicQuestionStats(),
        getCountriesWithQuestions()
      ]);
      
      setStats(statsData);
      setCountriesWithQuestions(countriesData);
      
      console.log("📊 Dynamic Question Stats:", statsData);
      console.log(`🌍 Countries with questions: ${countriesData.length}/195`);
    } catch (error) {
      console.error("Failed to load dynamic question stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Loading dynamic question system...</span>
        </div>
      </Card>
    );
  }

  const missingCountries = countries.filter(c => !countriesWithQuestions.includes(c.id));
  const coverage = (countriesWithQuestions.length / 195) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Database className="h-6 w-6" />
          Dynamic Question Storage System
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.totalCountries || 195}</div>
            <div className="text-sm text-muted-foreground">Total Countries</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.countriesWithQuestions || 0}</div>
            <div className="text-sm text-muted-foreground">With Questions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats?.totalQuestions || 0}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{coverage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Coverage</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Country Coverage</span>
            <span className="text-sm text-muted-foreground">{countriesWithQuestions.length}/195</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${coverage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Badge variant={coverage >= 100 ? "default" : "secondary"}>
            <Globe className="h-3 w-3 mr-1" />
            {coverage >= 100 ? "Complete Coverage" : "Partial Coverage"}
          </Badge>
          
          <Badge variant={stats?.totalQuestions > 500 ? "default" : "secondary"}>
            <BookOpen className="h-3 w-3 mr-1" />
            {stats?.totalQuestions > 500 ? "Rich Content" : "Building Content"}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button onClick={loadStats} variant="outline">
            Refresh Stats
          </Button>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Questions
          </Button>
        </div>
      </Card>

      {missingCountries.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Countries Missing Questions ({missingCountries.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {missingCountries.slice(0, 20).map(country => (
              <div key={country.id} className="text-sm p-2 bg-gray-100 rounded">
                {country.name}
              </div>
            ))}
            {missingCountries.length > 20 && (
              <div className="text-sm p-2 bg-gray-200 rounded text-center">
                +{missingCountries.length - 20} more
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Storage Information</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Storage Type:</strong> LocalStorage (Dynamic)</p>
          <p><strong>Storage Key:</strong> quiz_questions_v1</p>
          <p><strong>Auto-initialization:</strong> ✅ Enabled for all 195 countries</p>
          <p><strong>Question Generation:</strong> ✅ Basic questions created automatically</p>
          <p><strong>Real-time Updates:</strong> ✅ Questions can be added/modified dynamically</p>
        </div>
      </Card>
    </div>
  );
};
