
import { useState, useEffect } from "react";
import { MonitoringDashboard } from "@/components/monitoring/MonitoringDashboard";
import { UnifiedQuestionGenerationService } from "@/services/unified/questionGenerationService";
import { CountryService } from "@/services/supabase/countryService";
import { useToast } from "@/hooks/use-toast";
import { UnifiedErrorBoundary } from "@/components/error/UnifiedErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, RefreshCw, Play } from "lucide-react";

export default function ProductionDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleBulkGeneration = async () => {
    if (!confirm('Generate questions for all countries? This may take several minutes.')) return;
    
    setIsGenerating(true);
    try {
      const countries = await CountryService.getAllServiceCountries();
      const batchSize = 5;
      let completed = 0;
      
      toast({
        title: "Starting Bulk Generation",
        description: `Processing ${countries.length} countries in batches...`,
      });

      for (let i = 0; i < countries.length; i += batchSize) {
        const batch = countries.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (country) => {
          try {
            await UnifiedQuestionGenerationService.generateQuestions(
              country,
              'medium',
              5,
              'Geography',
              { primaryMode: 'template', fallbackEnabled: true }
            );
            completed++;
          } catch (error) {
            console.error(`Failed to generate for ${country.name}:`, error);
          }
        }));

        // Short delay between batches
        if (i + batchSize < countries.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      toast({
        title: "Bulk Generation Complete",
        description: `Successfully processed ${completed}/${countries.length} countries`,
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
                  Unified question generation and system monitoring
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
                    <Play className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Bulk Generate'}
                </Button>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">System Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-green-50 rounded">
                <h3 className="font-medium text-green-800">Primary: Template-Based</h3>
                <p className="text-green-700">Reliable, consistent question generation</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <h3 className="font-medium text-yellow-800">Fallback: Simple Templates</h3>
                <p className="text-yellow-700">Safety net for failed generations</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h3 className="font-medium text-blue-800">Monitoring: Real-time</h3>
                <p className="text-blue-700">System health and performance tracking</p>
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
