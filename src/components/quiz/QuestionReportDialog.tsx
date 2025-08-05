import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CommunityValidationService } from "@/services/quality/communityValidation";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Flag } from "lucide-react";

interface QuestionReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionText: string;
}

export const QuestionReportDialog: React.FC<QuestionReportDialogProps> = ({
  isOpen,
  onClose,
  questionId,
  questionText
}) => {
  const [issueType, setIssueType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const issueTypes = [
    { value: "duplicate", label: "Duplicate Question" },
    { value: "irrelevant", label: "Not Relevant to Country" },
    { value: "incorrect", label: "Incorrect Answer" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "poor_quality", label: "Poor Quality/Unclear" }
  ];

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an issue type and provide a description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await CommunityValidationService.reportQuestion(
        questionId,
        issueType as any,
        description.trim()
      );

      if (success) {
        toast({
          title: "Report Submitted",
          description: "Thank you for helping improve question quality!",
        });
        onClose();
        setIssueType("");
        setDescription("");
      } else {
        throw new Error("Failed to submit report");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Report Question Issue
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Question:</p>
            <p className="text-sm font-medium mt-1">
              {questionText.substring(0, 100)}
              {questionText.length > 100 ? "..." : ""}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Issue Type</label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Please provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-xs text-amber-700">
              Reports help moderators identify and fix quality issues.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};