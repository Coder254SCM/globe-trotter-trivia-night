
import { useState, useEffect } from "react";
import { MonitoringDashboard } from "@/components/monitoring/MonitoringDashboard";
import { CountryService } from "@/services/supabase/countryService";
import { BulkQuestionGenerator } from "@/services/simple/bulkQuestionGenerator";
import { useToast } from "@/hooks/use-toast";
import { UnifiedErrorBoundary } from "@/components/error/UnifiedErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, RefreshCw, Play, Zap } from "lucide-react";

export default function ProductionDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleBulkGeneration = async () => {
    if (!confirm('Generate 50+ questions for all countries? This will create a comprehensive question database.')) return;
    
    setIsGenerating(true);
    try {
      const countries = await CountryService.getAllServiceCountries();
      
      toast({
        title: "Starting Bulk Generation",
        description: `Processing ${countries.length} countries with 50+ questions each...`,
      });

      await BulkQuestionGenerator.generateForAllCountries(countries, 50);

      toast({
        title: "Bulk Generation Complete!",
        description: `Successfully generated questions for all countries`,
      });
    } catch (error) {
      console.error('Bulk generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "An error occurred during bulk generation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
                  Simple template-based question generation system
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkGeneration}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate All Questions'}
                </Button>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Simple Template System</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-green-50 rounded">
                <h3 className="font-medium text-green-800">✅ Template-Based</h3>
                <p className="text-green-700">50+ unique questions per country</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h3 className="font-medium text-blue-800">🔄 Randomized</h3>
                <p className="text-blue-700">Questions randomized every quiz</p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <h3 className="font-medium text-purple-800">📝 No Hardcoding</h3>
                <p className="text-purple-700">Dynamic generation from templates</p>
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
