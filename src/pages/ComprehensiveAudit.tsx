
import { ComprehensiveQuestionAudit } from "../components/admin/ComprehensiveQuestionAudit";

const ComprehensiveAudit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Question Quality Audit</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of all questions in your Supabase database
          </p>
        </div>
        <ComprehensiveQuestionAudit />
      </div>
    </div>
  );
};

export default ComprehensiveAudit;
