
import { Progress } from "../../ui/progress";

interface GenerationProgressProps {
  progress: number;
  currentCountry?: string;
  isGenerating: boolean;
}

export const GenerationProgress = ({ progress, currentCountry, isGenerating }: GenerationProgressProps) => {
  if (!isGenerating) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>
          {currentCountry ? `Generating for: ${currentCountry}` : "Generating questions..."}
        </span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
