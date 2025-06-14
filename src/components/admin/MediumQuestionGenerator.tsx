
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const MediumQuestionGenerator = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Medium Question Generator - Permanently Disabled
          </CardTitle>
          <CardDescription>
            The medium question generator has been permanently disabled due to quality and error issues.
            Please use the hard question generator or manual hard question generator for reliable question generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            This feature is no longer available to ensure system reliability.
          </p>
          <p className="text-sm text-muted-foreground">
            We recommend using the hard question generator which produces error-free, high-quality questions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
