
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface QuizSettingsProps {
  onStartQuiz: (questionCount: number) => void;
  countryName: string;
  onBack: () => void;
}

export const QuizSettings = ({ onStartQuiz, countryName, onBack }: QuizSettingsProps) => {
  const [selectedCount, setSelectedCount] = useState<string>("10");

  const handleStartQuiz = () => {
    onStartQuiz(parseInt(selectedCount));
  };

  return (
    <div className="min-h-screen w-full p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Settings className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Quiz Settings</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Choose how many questions for your {countryName} quiz
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <RadioGroup value={selectedCount} onValueChange={setSelectedCount}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="10" id="10" />
              <Label htmlFor="10" className="flex-1 cursor-pointer">
                <div className="font-medium">Quick Quiz</div>
                <div className="text-sm text-muted-foreground">10 questions • ~5 minutes</div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="20" id="20" />
              <Label htmlFor="20" className="flex-1 cursor-pointer">
                <div className="font-medium">Standard Quiz</div>
                <div className="text-sm text-muted-foreground">20 questions • ~10 minutes</div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="30" id="30" />
              <Label htmlFor="30" className="flex-1 cursor-pointer">
                <div className="font-medium">Challenge Quiz</div>
                <div className="text-sm text-muted-foreground">30 questions • ~15 minutes</div>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button onClick={handleStartQuiz} className="flex-1">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
