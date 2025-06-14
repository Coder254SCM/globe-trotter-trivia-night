
import { HardQuestionGeneratorComponent } from "../components/admin/HardQuestionGenerator";

const HardQuestions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <HardQuestionGeneratorComponent />
      </div>
    </div>
  );
};

export default HardQuestions;
