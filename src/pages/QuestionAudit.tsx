
import { SupabaseQuestionAudit } from "../components/admin/SupabaseQuestionAudit";

const QuestionAudit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <SupabaseQuestionAudit />
      </div>
    </div>
  );
};

export default QuestionAudit;
