
import { useState, useEffect } from "react";
import { MonitoringDashboard } from "@/components/monitoring/MonitoringDashboard";
import { CountryService } from "@/services/supabase/countryService";
import { DatabaseInitializationService } from "@/services/database/initializationService";
import { useToast } from "@/hooks/use-toast";
import { UnifiedErrorBoundary } from "@/components/error/UnifiedErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, RefreshCw, Play, Zap, Database, CheckCircle } from "lucide-react";

export default function ProductionDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState<string>('ready');
  const { toast } = useToast();

  const handleFullInitialization = async () => {
    if (!confirm('Initialize complete database with 50+ questions per country for all 195 countries? This will create 15,000+ questions.')) return;
    
    setIsGenerating(true);
    setInitializationStatus('initializing');
    
    try {
      toast({
        title: "Full Database Initialization",
        description: "Creating comprehensive question database for all countries...",
      });

      await DatabaseInitializationService.initializeDatabase();
      setInitializationStatus('complete');

      toast({
        title: "Database Initialization Complete!",
        description: "All 195 countries now have 50+ unique questions each",
      });
    } catch (error) {
      console.error('Full initialization failed:', error);
      setInitializationStatus('error');
      toast({
        title: "Initialization Failed",
        description: "An error occurred during full database initialization",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickTest = async () => {
    try {
      const countries = await CountryService.getAllServiceCountries();
      const testCountry = countries.find(c => c.name === 'Albania');
      
      if (testCountry) {
        const hasQuestions = await DatabaseInitializationService.ensureCountryHasQuestions(testCountry.id);
        toast({
          title: "Test Complete",
          description: `Albania ${hasQuestions ? 'has sufficient' : 'needs more'} questions`,
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not test country questions",
        variant: "destructive",
      });
    }
  };

  return (
    <UnifiedErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  Production Control Center
                </h1>
                <p className="text-muted-foreground mt-2">
                  Enhanced template-based question generation system
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleQuickTest}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Quick Test
                </Button>
                
                <Button
                  onClick={handleFullInitialization}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Initializing...' : 'Full Initialize'}
                </Button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Enhanced Template System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-green-50 rounded">
                <h3 className="font-medium text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Template Variety
                </h3>
                <p className="text-green-700">5+ categories, 20+ templates each</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h3 className="font-medium text-blue-800 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Question Volume
                </h3>
                <p className="text-blue-700">50+ questions per country</p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <h3 className="font-medium text-purple-800 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Randomization
                </h3>
                <p className="text-purple-700">Proper shuffling every quiz</p>
              </div>
              <div className={`p-3 rounded ${
                initializationStatus === 'complete' ? 'bg-green-50' : 
                initializationStatus === 'error' ? 'bg-red-50' : 'bg-yellow-50'
              }`}>
                <h3 className={`font-medium flex items-center gap-2 ${
                  initializationStatus === 'complete' ? 'text-green-800' : 
                  initializationStatus === 'error' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  <Target className="h-4 w-4" />
                  Status
                </h3>
                <p className={
                  initializationStatus === 'complete' ? 'text-green-700' : 
                  initializationStatus === 'error' ? 'text-red-700' : 'text-yellow-700'
                }>
                  {initializationStatus === 'complete' ? 'Fully Initialized' :
                   initializationStatus === 'error' ? 'Error Occurred' :
                   initializationStatus === 'initializing' ? 'Initializing...' : 'Ready to Initialize'}
                </p>
              </div>
            </div>
          </Card>

          {/* Monitoring Dashboard */}
          <MonitoringDashboard />
        </div>
      </div>
    </UnifiedErrorBoundary>
  );
}
