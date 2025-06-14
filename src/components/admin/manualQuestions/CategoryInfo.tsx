
import { Card } from "../../ui/card";

export const CategoryInfo = () => {
  return (
    <Card className="p-6 bg-muted/50">
      <h3 className="text-lg font-semibold mb-2">Manual PhD-Level Question Categories (30 Total)</h3>
      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        <ul className="space-y-1">
          <li>• Constitutional Law</li>
          <li>• Economic Policy</li>
          <li>• Diplomatic History</li>
          <li>• Archaeological Research</li>
          <li>• Linguistic Studies</li>
          <li>• Environmental Science</li>
          <li>• Anthropological Studies</li>
          <li>• Neuropsychology</li>
          <li>• Quantum Physics</li>
          <li>• Molecular Biology</li>
          <li>• Astrophysics</li>
          <li>• Computational Mathematics</li>
          <li>• Materials Science</li>
          <li>• Cognitive Science</li>
          <li>• Biochemistry</li>
        </ul>
        <ul className="space-y-1">
          <li>• Geophysics</li>
          <li>• Epidemiology</li>
          <li>• Behavioral Economics</li>
          <li>• Information Theory</li>
          <li>• Robotics Engineering</li>
          <li>• Pharmacology</li>
          <li>• Crystallography</li>
          <li>• Fluid Dynamics</li>
          <li>• Social Network Analysis</li>
          <li>• Proteomics</li>
          <li>• Game Theory</li>
          <li>• Synthetic Biology</li>
          <li>• Metamaterials</li>
          <li>• Complexity Science</li>
          <li>• Space Technology</li>
        </ul>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        All questions are manually crafted to require doctoral-level expertise and cover specialized academic knowledge across multiple advanced disciplines.
      </p>
    </Card>
  );
};
