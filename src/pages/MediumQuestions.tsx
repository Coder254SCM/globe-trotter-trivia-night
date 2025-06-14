
import { MediumQuestionGenerator } from "@/components/admin/MediumQuestionGenerator";

export default function MediumQuestions() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Medium Questions Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate high-quality medium difficulty questions with comprehensive validation
          </p>
        </div>
        
        <MediumQuestionGenerator />
      </div>
    </div>
  );
}
