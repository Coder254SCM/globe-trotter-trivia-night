
import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import { ValidationEnforcementService } from "../../services/supabase/validationEnforcementService";
import { AlertTriangle, Trash2, Shield, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QuestionValidationDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    critical: 0,
    placeholderCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingPlaceholders, setIsDeletingPlaceholders] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const validationStats = await ValidationEnforcementService.getValidationStats();
      setStats(validationStats);
    } catch (error) {
      console.error('Failed to load validation stats:', error);
      toast({
        title: "Error",
        description: "Failed to load validation statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaceholders = async () => {
    if (!confirm('This will permanently delete ALL questions with placeholder content. Continue?')) {
      return;
    }

    setIsDeletingPlaceholders(true);
    try {
      const result = await ValidationEnforcementService.deleteAllPlaceholderQuestions();
      
      toast({
        title: "Cleanup Complete",
        description: `Deleted ${result.deleted} placeholder questions. ${result.errors.length > 0 ? 'Some errors occurred.' : ''}`,
        variant: result.errors.length > 0 ? "destructive" : "default",
      });

      if (result.errors.length > 0) {
        console.error('Deletion errors:', result.errors);
      }

      await loadStats();
    } catch (error) {
      console.error('Failed to delete placeholder questions:', error);
      toast({
        title: "Error",
        description: "Failed to delete placeholder questions",
        variant: "destructive",
      });
    } finally {
      setIsDeletingPlaceholders(false);
    }
  };

  const qualityPercentage = stats.total > 0 ? Math.round((stats.valid / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Question Validation Dashboard</h2>
          <p className="text-muted-foreground">Monitor and enforce question quality standards</p>
        </div>
      </div>

      {stats.critical > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Critical Issues Found:</strong> {stats.critical} questions have critical validation errors that must be resolved.
          </AlertDescription>
        </Alert>
      )}

      {stats.placeholderCount > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>Placeholder Content Detected:</strong> {stats.placeholderCount} questions contain generic placeholder text and should be removed.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valid</p>
              <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invalid</p>
              <p className="text-2xl font-bold text-red-600">{stats.invalid}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-800">{stats.critical}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-800" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Placeholders</p>
              <p className="text-2xl font-bold text-orange-600">{stats.placeholderCount}</p>
            </div>
            <Trash2 className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Overall Quality Score</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Quality Percentage</span>
            <Badge variant={qualityPercentage >= 80 ? "default" : qualityPercentage >= 60 ? "secondary" : "destructive"}>
              {qualityPercentage}%
            </Badge>
          </div>
          <Progress value={qualityPercentage} className="h-3" />
        </div>
        {qualityPercentage < 80 && (
          <p className="text-sm text-muted-foreground mt-2">
            Recommendation: Clean up invalid questions to improve overall quality.
          </p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Validation Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Delete Placeholder Questions</h4>
              <p className="text-sm text-muted-foreground">
                Remove all questions containing generic placeholder content
              </p>
            </div>
            <Button
              onClick={handleDeletePlaceholders}
              disabled={isDeletingPlaceholders || stats.placeholderCount === 0}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isDeletingPlaceholders ? (
                <>Loading...</>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Placeholders
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Refresh Statistics</h4>
              <p className="text-sm text-muted-foreground">
                Reload validation statistics from database
              </p>
            </div>
            <Button
              onClick={loadStats}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Validation Rules</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>No placeholder text patterns (methodology A, approach B, etc.)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Correct answer must match one of the options</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Minimum question text length (20 characters)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>No duplicate answer options</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Valid difficulty level (easy/medium/hard)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Meaningful explanations required</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
