
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CommunityService } from "@/services/supabase/communityService";
import { PlusCircle } from "lucide-react";

interface CommunityQuestionFormProps {
  countryId: string;
  countryName: string;
  onSuccess?: () => void;
}

const categories = [
  "Geography", "History", "Culture", "Politics", "Economy", 
  "Sports", "Food", "Language", "Religion", "Art"
];

export const CommunityQuestionForm = ({ countryId, countryName, onSuccess }: CommunityQuestionFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    explanation: "",
    category: "",
    difficulty: "medium" as "easy" | "medium" | "hard"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text || !formData.option_a || !formData.option_b || !formData.option_c || !formData.option_d) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.correct_answer) {
      toast({
        title: "No Correct Answer",
        description: "Please select the correct answer.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await CommunityService.submitQuestion({
        ...formData,
        country_id: countryId
      });

      toast({
        title: "Question Submitted!",
        description: "Your question has been submitted for moderation. Thank you for contributing!",
      });

      // Reset form
      setFormData({
        text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        explanation: "",
        category: "",
        difficulty: "medium"
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Submit Question for {countryName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              placeholder="Enter your question about this country..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="option_a">Option A *</Label>
              <Input
                id="option_a"
                value={formData.option_a}
                onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="option_b">Option B *</Label>
              <Input
                id="option_b"
                value={formData.option_b}
                onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="option_c">Option C *</Label>
              <Input
                id="option_c"
                value={formData.option_c}
                onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="option_d">Option D *</Label>
              <Input
                id="option_d"
                value={formData.option_d}
                onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Correct Answer *</Label>
            <RadioGroup
              value={formData.correct_answer}
              onValueChange={(value) => setFormData({ ...formData, correct_answer: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={formData.option_a} id="correct_a" />
                <Label htmlFor="correct_a">A: {formData.option_a}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={formData.option_b} id="correct_b" />
                <Label htmlFor="correct_b">B: {formData.option_b}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={formData.option_c} id="correct_c" />
                <Label htmlFor="correct_c">C: {formData.option_c}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={formData.option_d} id="correct_d" />
                <Label htmlFor="correct_d">D: {formData.option_d}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              placeholder="Provide additional context or explanation for the answer..."
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
