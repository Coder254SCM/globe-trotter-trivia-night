
import { ManualHardQuestionGeneratorComponent } from "./ManualHardQuestionGenerator";
import { Card } from "../ui/card";
import { FileText, CheckCircle2, Brain } from "lucide-react";

export const ManualQuestionDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Manual Question Generation</h2>
          <p className="text-muted-foreground">
            Generate PhD-level questions using expert knowledge (AI-independent)
          </p>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">AI-Independent Solution</h3>
            <p className="text-sm text-green-700 mt-1">
              Since the AI service is currently unavailable, this manual generator creates 
              PhD-level questions using expert knowledge across 10 academic categories. 
              All questions are crafted to require doctoral-level expertise.
            </p>
          </div>
        </div>
      </Card>

      <ManualHardQuestionGeneratorComponent />

      <Card className="p-6 bg-muted/50">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Quality Assurance</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Each question requires specialized academic knowledge and research expertise</li>
          <li>• Questions cover constitutional law, economics, diplomacy, archaeology, and linguistics</li>
          <li>• Includes specific technical terminology and methodological frameworks</li>
          <li>• Designed for country specialists, researchers, and doctoral students</li>
          <li>• All questions include detailed explanations with academic context</li>
          <li>• Covers demographic analysis, legal systems, political theory, and historical methods</li>
        </ul>
      </Card>
    </div>
  );
};
