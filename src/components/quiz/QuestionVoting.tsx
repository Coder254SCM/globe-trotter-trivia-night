import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CommunityValidationService } from "@/services/quality/communityValidation";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { QuestionReportDialog } from "./QuestionReportDialog";

interface QuestionVotingProps {
  questionId: string;
  questionText: string;
  className?: string;
}

export const QuestionVoting: React.FC<QuestionVotingProps> = ({
  questionId,
  questionText,
  className = ""
}) => {
  const [metrics, setMetrics] = useState({
    upvotes: 0,
    downvotes: 0,
    reports: 0,
    qualityScore: 50
  });
  const [isVoting, setIsVoting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMetrics();
  }, [questionId]);

  const loadMetrics = async () => {
    try {
      const data = await CommunityValidationService.getQuestionQualityMetrics(questionId);
      setMetrics(data);
    } catch (error) {
      console.error("Failed to load question metrics:", error);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    setIsVoting(true);
    
    try {
      const success = await CommunityValidationService.voteOnQuestion(questionId, voteType);
      
      if (success) {
        toast({
          title: "Vote Recorded",
          description: `Thank you for rating this question!`,
        });
        await loadMetrics();
      } else {
        throw new Error("Failed to record vote");
      }
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('upvote')}
            disabled={isVoting}
            className="h-8 px-2"
          >
            <ThumbsUp className="h-3 w-3" />
            <span className="text-xs ml-1">{metrics.upvotes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('downvote')}
            disabled={isVoting}
            className="h-8 px-2"
          >
            <ThumbsDown className="h-3 w-3" />
            <span className="text-xs ml-1">{metrics.downvotes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReportDialog(true)}
            className="h-8 px-2 text-destructive hover:text-destructive"
          >
            <Flag className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="text-xs">
          <span className="text-muted-foreground">Quality: </span>
          <span className={getQualityColor(metrics.qualityScore)}>
            {metrics.qualityScore}%
          </span>
        </div>
      </div>

      <QuestionReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        questionId={questionId}
        questionText={questionText}
      />
    </>
  );
};