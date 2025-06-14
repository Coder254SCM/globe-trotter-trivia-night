import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuestionValidationService, ValidationResult } from "@/services/supabase/questionValidationService";

export default function QuestionValidationDashboard() {
  const [testQuestion, setTestQuestion] = useState({
    text: "What is the capital of France?",
    option_a: "London",
    option_b: "Berlin", 
    option_c: "Paris",
    option_d: "Madrid",
    correct_answer: "Paris",
    difficulty: "medium" as const,
    category: "Geography"
  });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const validateQuestion = async () => {
    setLoading(true);
    try {
      const result = await QuestionValidationService.preValidateQuestion(testQuestion);
      setValidationResult(result);
    } catch (error) {
      console.error("Validation failed", error);
      setValidationResult({
        isValid: false,
        issues: ["Validation failed due to an unexpected error."],
        severity: "critical",
        questionText: testQuestion.text.substring(0, 60) + "..."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Question Validation Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="text">Question Text</label>
              <Textarea
                id="text"
                name="text"
                value={testQuestion.text}
                onChange={handleInputChange}
                placeholder="Enter question text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="option_a">Option A</label>
                <Input
                  type="text"
                  id="option_a"
                  name="option_a"
                  value={testQuestion.option_a}
                  onChange={handleInputChange}
                  placeholder="Option A"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="option_b">Option B</label>
                <Input
                  type="text"
                  id="option_b"
                  name="option_b"
                  value={testQuestion.option_b}
                  onChange={handleInputChange}
                  placeholder="Option B"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="option_c">Option C</label>
                <Input
                  type="text"
                  id="option_c"
                  name="option_c"
                  value={testQuestion.option_c}
                  onChange={handleInputChange}
                  placeholder="Option C"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="option_d">Option D</label>
                <Input
                  type="text"
                  id="option_d"
                  name="option_d"
                  value={testQuestion.option_d}
                  onChange={handleInputChange}
                  placeholder="Option D"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="correct_answer">Correct Answer</label>
              <Input
                type="text"
                id="correct_answer"
                name="correct_answer"
                value={testQuestion.correct_answer}
                onChange={handleInputChange}
                placeholder="Correct Answer"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category">Category</label>
              <Input
                type="text"
                id="category"
                name="category"
                value={testQuestion.category}
                onChange={handleInputChange}
                placeholder="Category"
              />
            </div>
            <Button onClick={validateQuestion} disabled={loading}>
              {loading ? "Validating..." : "Validate Question"}
            </Button>
          </CardContent>
        </Card>

        {validationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Validation Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Status:</strong>{" "}
                  {validationResult.isValid ? (
                    <Badge variant="outline">Valid</Badge>
                  ) : (
                    <Badge variant="destructive">Invalid</Badge>
                  )}
                </p>
                {validationResult.issues.length > 0 && (
                  <div>
                    <strong>Issues:</strong>
                    <ul className="list-disc pl-5">
                      {validationResult.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p>
                  <strong>Severity:</strong>{" "}
                  <Badge>{validationResult.severity}</Badge>
                </p>
                <p>
                  <strong>Question Preview:</strong>{" "}
                  {validationResult.questionText}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
