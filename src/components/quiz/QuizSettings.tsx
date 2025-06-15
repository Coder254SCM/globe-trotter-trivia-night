
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, PlusCircle } from "lucide-react";
import { CommunityQuestionForm } from "@/components/community/CommunityQuestionForm";

interface QuizSettingsProps {
  onStartQuiz: (questionCount: number) => void;
  countryName: string;
  countryId: string;
  onBack: () => void;
}

export const QuizSettings = ({ onStartQuiz, countryName, countryId, onBack }: QuizSettingsProps) => {
  const [selectedCount, setSelectedCount] = useState<string>("10");
  const [activeTab, setActiveTab] = useState("quiz");

  const handleStartQuiz = () => {
    onStartQuiz(parseInt(selectedCount));
  };

  return (
    <div className="w-full p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Quiz Settings
            </TabsTrigger>
            <TabsTrigger value="contribute" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Question
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Settings className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Quiz Settings</CardTitle>
                </div>
                <p className="text-muted-foreground">
                  Choose how many questions for your {countryName} quiz
                </p>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Questions include community contributions
                </div>
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
          </TabsContent>

          <TabsContent value="contribute">
            <CommunityQuestionForm 
              countryId={countryId}
              countryName={countryName}
              onSuccess={() => setActiveTab("quiz")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
