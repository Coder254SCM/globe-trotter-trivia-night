
import { QuestionValidationDashboard } from "@/components/admin/QuestionValidationDashboard";

export default function QuestionValidation() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Question Validation System</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive validation to ensure question quality and prevent placeholder content
          </p>
        </div>
        
        <QuestionValidationDashboard />
      </div>
    </div>
  );
}
