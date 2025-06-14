
import { MediumQuestionGenerator } from "@/components/admin/MediumQuestionGenerator";

export default function MediumQuestions() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Medium Questions</h1>
          <p className="text-muted-foreground mt-2">
            Medium question generation is temporarily unavailable
          </p>
        </div>
        
        <MediumQuestionGenerator />
      </div>
    </div>
  );
}
