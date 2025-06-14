
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const MediumQuestionGenerator = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Medium Question Generator - Temporarily Disabled
          </CardTitle>
          <CardDescription>
            The medium question generator has been temporarily disabled due to quality issues.
            Please use the hard question generator for reliable question generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            This feature is currently unavailable. We recommend using the hard question generator instead.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
