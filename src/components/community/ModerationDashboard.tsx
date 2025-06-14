
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CommunityService, CommunityQuestion } from "@/services/supabase/communityService";
import { CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown } from "lucide-react";

export const ModerationDashboard = () => {
  const { toast } = useToast();
  const [pendingQuestions, setPendingQuestions] = useState<CommunityQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");

  useEffect(() => {
    loadPendingQuestions();
  }, []);

  const loadPendingQuestions = async () => {
    try {
      const questions = await CommunityService.getPendingQuestions();
      setPendingQuestions(questions);
    } catch (error) {
      console.error('Error loading pending questions:', error);
      toast({
        title: "Error",
        description: "Failed to load pending questions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = async (questionId: string, status: 'approved' | 'rejected') => {
    setModeratingId(questionId);
    
    try {
      await CommunityService.moderateQuestion(questionId, status, moderationNotes);
      
      toast({
        title: `Question ${status}`,
        description: `The question has been ${status}.`,
      });

      // Remove from pending list
      setPendingQuestions(prev => prev.filter(q => q.id !== questionId));
      setModerationNotes("");
    } catch (error) {
      console.error('Error moderating question:', error);
      toast({
        title: "Moderation Failed",
        description: "There was an error processing the moderation.",
        variant: "destructive"
      });
    } finally {
      setModeratingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading pending questions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Question Moderation</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pendingQuestions.length} Pending
        </Badge>
      </div>

      {pendingQuestions.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">All Caught Up!</h3>
              <p className="text-muted-foreground">No questions pending moderation.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{question.text}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{question.category}</Badge>
                      <Badge variant="outline">{question.difficulty}</Badge>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {question.votes_up}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />
                        {question.votes_down}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {question.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2 rounded border ${question.correct_answer === question.option_a ? 'bg-green-50 border-green-200' : ''}`}>
                    <strong>A:</strong> {question.option_a}
                  </div>
                  <div className={`p-2 rounded border ${question.correct_answer === question.option_b ? 'bg-green-50 border-green-200' : ''}`}>
                    <strong>B:</strong> {question.option_b}
                  </div>
                  <div className={`p-2 rounded border ${question.correct_answer === question.option_c ? 'bg-green-50 border-green-200' : ''}`}>
                    <strong>C:</strong> {question.option_c}
                  </div>
                  <div className={`p-2 rounded border ${question.correct_answer === question.option_d ? 'bg-green-50 border-green-200' : ''}`}>
                    <strong>D:</strong> {question.option_d}
                  </div>
                </div>

                {question.explanation && (
                  <div className="p-3 bg-muted rounded">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add moderation notes (optional)..."
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleModerate(question.id, 'approved')}
                      disabled={moderatingId === question.id}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleModerate(question.id, 'rejected')}
                      disabled={moderatingId === question.id}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
