
import { ManualHardQuestionGeneratorComponent } from "../components/admin/ManualHardQuestionGenerator";

const ManualHardQuestions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <ManualHardQuestionGeneratorComponent />
      </div>
    </div>
  );
};

export default ManualHardQuestions;
