
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface GenerationProgressProps {
  isGenerating: boolean;
  progress: number;
  currentCountry: string;
}

export const GenerationProgress = ({ isGenerating, progress, currentCountry }: GenerationProgressProps) => {
  if (!isGenerating) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">
          {currentCountry ? `Generating for ${currentCountry}...` : "Starting generation..."}
        </span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};
