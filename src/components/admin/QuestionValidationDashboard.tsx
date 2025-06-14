
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionValidationService, QuestionToValidate, ValidationResult } from "@/services/supabase/questionValidationService";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertTriangle, Info, Shield, Database } from "lucide-react";

export const QuestionValidationDashboard = () => {
  const [testQuestion, setTestQuestion] = useState<QuestionToValidate>({
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    category: "Geography"
  });
  
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const { toast } = useToast();

  const validateQuestion = async () => {
    setValidating(true);
    try {
      // First do quick client-side validation
      const quickResult = QuestionValidationService.quickValidate(testQuestion);
      
      // Then do database validation if no critical issues
      let dbResult = quickResult;
      if (quickResult.severity !== 'critical') {
        dbResult = await QuestionValidationService.preValidateQuestion(testQuestion);
      }
      
      setValidationResult(dbResult);
      
      if (dbResult.isValid) {
        toast({
          title: "Validation Passed! ✅",
          description: "Question meets all quality standards",
        });
      } else {
        toast({
          title: `Validation Failed (${dbResult.severity.toUpperCase()})`,
          description: `Found ${dbResult.issues.length} issues`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
      toast({
        title: "Validation Error",
        description: "Could not validate question",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Question Validation System
          </CardTitle>
          <CardDescription>
            Comprehensive validation to prevent placeholder questions and ensure quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-500 bg-blue-50">
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>🛡️ Active Protection:</strong> Database triggers now automatically reject questions with placeholder text, invalid answers, or quality issues.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Input Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Question Validation</h3>
              
              <div>
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  placeholder="Enter your question here..."
                  value={testQuestion.text}
                  onChange={(e) => setTestQuestion(prev => ({ ...prev, text: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="option-a">Option A</Label>
                  <Input
                    id="option-a"
                    placeholder="First option"
                    value={testQuestion.option_a}
                    onChange={(e) => setTestQuestion(prev => ({ ...prev, option_a: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="option-b">Option B</Label>
                  <Input
                    id="option-b"
                    placeholder="Second option"
                    value={testQuestion.option_b}
                    onChange={(e) => setTestQuestion(prev => ({ ...prev, option_b: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="option-c">Option C</Label>
                  <Input
                    id="option-c"
                    placeholder="Third option"
                    value={testQuestion.option_c}
                    onChange={(e) => setTestQuestion(prev => ({ ...prev, option_c: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="option-d">Option D</Label>
                  <Input
                    id="option-d"
                    placeholder="Fourth option"
                    value={testQuestion.option_d}
                    onChange={(e) => setTestQuestion(prev => ({ ...prev, option_d: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="correct-answer">Correct Answer</Label>
                <Input
                  id="correct-answer"
                  placeholder="Must match one of the options exactly"
                  value={testQuestion.correct_answer}
                  onChange={(e) => setTestQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
                />
              </div>

              <Button 
                onClick={validateQuestion}
                disabled={validating || !testQuestion.text}
                className="w-full"
              >
                {validating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Validating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Validate Question
                  </>
                )}
              </Button>
            </div>

            {/* Validation Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Validation Results</h3>
              
              {validationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(validationResult.severity)}
                    <span className="font-medium">
                      {validationResult.isValid ? "✅ PASSED" : "❌ FAILED"}
                    </span>
                    <Badge variant={getSeverityColor(validationResult.severity)}>
                      {validationResult.severity.toUpperCase()}
                    </Badge>
                  </div>

                  {validationResult.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-600">Issues Found:</h4>
                      {validationResult.issues.map((issue, index) => (
                        <Alert key={index} className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {validationResult.isValid && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Perfect!</strong> This question meets all quality standards and would be accepted by the system.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Enter a question above and click "Validate Question" to test the validation system.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protection Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle>🛡️ Active Protection Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Placeholder Detection</strong><br />
                Automatically rejects questions with "option A for", "placeholder", etc.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <strong>Answer Validation</strong><br />
                Ensures correct answer matches exactly one of the four options.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-purple-200 bg-purple-50">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <AlertDescription>
                <strong>Quality Standards</strong><br />
                Enforces minimum length, no duplicates, proper formatting.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-orange-200 bg-orange-50">
              <CheckCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                <strong>Country Validation</strong><br />
                Verifies country assignments against existing database.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-red-200 bg-red-50">
              <CheckCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>Admin-Only Access</strong><br />
                Only authenticated admins can add/edit questions directly.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-yellow-200 bg-yellow-50">
              <CheckCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <strong>Pre-Check System</strong><br />
                Frontend validation prevents bad questions before submission.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
