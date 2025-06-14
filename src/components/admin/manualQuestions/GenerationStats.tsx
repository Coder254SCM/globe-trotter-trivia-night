
import { Card } from "../../ui/card";

interface GenerationStatsProps {
  stats: {
    totalQuestions: string;
    avgPerCountry: number;
    difficulty: string;
  } | null;
}

export const GenerationStats = ({ stats }: GenerationStatsProps) => {
  if (!stats) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Generation Statistics</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">{stats.totalQuestions}</div>
          <div className="text-sm text-muted-foreground">Total Generated</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{stats.avgPerCountry}</div>
          <div className="text-sm text-muted-foreground">Per Country</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{stats.difficulty}</div>
          <div className="text-sm text-muted-foreground">Difficulty Level</div>
        </div>
      </div>
    </Card>
  );
};
