
import { EasyQuestionGenerator } from "@/components/admin/EasyQuestionGenerator";

export default function EasyQuestions() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Easy Questions Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate beginner-friendly questions with foolproof validation
          </p>
        </div>
        
        <EasyQuestionGenerator />
      </div>
    </div>
  );
}
