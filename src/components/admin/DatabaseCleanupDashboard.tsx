import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedQuestionDeduplication } from "@/services/quality/enhancedDeduplication";
import { useToast } from "@/hooks/use-toast";
import { Trash2, RefreshCw, Database, CheckCircle } from "lucide-react";
import COUNTRIES from "@/data/countries";

export const DatabaseCleanupDashboard: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleDeduplication = async () => {
    if (!selectedCountry) {
      toast({
        title: "Select Country",
        description: "Please select a country to clean up.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log(`🧹 Starting cleanup for ${selectedCountry}...`);
      const result = await EnhancedQuestionDeduplication.runComprehensiveCleanup(selectedCountry);
      setResults(result);
      
      toast({
        title: "Cleanup Complete",
        description: `Removed ${result.deduplication.removedCount + result.validation.removedCount} problematic questions.`,
      });
    } catch (error) {
      console.error("Cleanup failed:", error);
      toast({
        title: "Cleanup Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGlobalInvalidCleanup = async () => {
    setIsProcessing(true);
    
    try {
      console.log(`🧹 Starting global invalid question cleanup...`);
      const result = await EnhancedQuestionDeduplication.removeInvalidQuestions();
      
      toast({
        title: "Global Cleanup Complete",
        description: `Removed ${result.removedCount} invalid questions globally.`,
      });
    } catch (error) {
      console.error("Global cleanup failed:", error);
      toast({
        title: "Cleanup Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Cleanup Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Country-Specific Cleanup</h3>
              
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country to clean up" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={handleDeduplication}
                disabled={isProcessing || !selectedCountry}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Run Cleanup
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Global Cleanup</h3>
              <p className="text-sm text-muted-foreground">
                Remove all invalid questions across all countries
              </p>
              
              <Button
                onClick={handleGlobalInvalidCleanup}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clean Invalid Questions
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Cleanup Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Deduplication</h4>
                <p className="text-2xl font-bold text-red-600">{results.deduplication.removedCount}</p>
                <p className="text-xs text-muted-foreground">Duplicates removed</p>
                <p className="text-2xl font-bold text-green-600">{results.deduplication.keepCount}</p>
                <p className="text-xs text-muted-foreground">Questions kept</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Validation</h4>
                <p className="text-2xl font-bold text-red-600">{results.validation.removedCount}</p>
                <p className="text-xs text-muted-foreground">Invalid removed</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Final Stats</h4>
                <p className="text-2xl font-bold text-blue-600">{results.finalStats.total}</p>
                <p className="text-xs text-muted-foreground">Total questions</p>
                <div className="text-xs space-y-1">
                  <div>Easy: {results.finalStats.easy}</div>
                  <div>Medium: {results.finalStats.medium}</div>
                  <div>Hard: {results.finalStats.hard}</div>
                </div>
              </div>
            </div>
            
            {results.validation.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm text-red-600">Issues Found:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {results.validation.issues.map((issue: string, index: number) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};