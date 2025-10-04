import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users } from "lucide-react";

interface RoomCreatorProps {
  onCreateRoom: (settings: {
    maxPlayers?: number;
    questionsPerGame?: number;
    timePerQuestion?: number;
    difficultyFilter?: string;
  }) => void;
  isLoading?: boolean;
}

export const RoomCreator = ({ onCreateRoom, isLoading }: RoomCreatorProps) => {
  const [maxPlayers, setMaxPlayers] = useState(50);
  const [questionsPerGame, setQuestionsPerGame] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [difficulty, setDifficulty] = useState<string>('');

  const handleCreate = () => {
    onCreateRoom({
      maxPlayers,
      questionsPerGame,
      timePerQuestion,
      difficultyFilter: difficulty || undefined
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Plus className="h-6 w-6 text-primary" />
        Create Game Room
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="maxPlayers">Max Players</Label>
          <Input
            id="maxPlayers"
            type="number"
            min={2}
            max={100}
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="questions">Questions Per Game</Label>
          <Input
            id="questions"
            type="number"
            min={5}
            max={50}
            value={questionsPerGame}
            onChange={(e) => setQuestionsPerGame(parseInt(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="time">Time Per Question (seconds)</Label>
          <Input
            id="time"
            type="number"
            min={10}
            max={120}
            value={timePerQuestion}
            onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty Filter (Optional)</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Any difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCreate} 
          disabled={isLoading}
          className="w-full mt-6"
        >
          <Users className="h-4 w-4 mr-2" />
          {isLoading ? 'Creating...' : 'Create Room'}
        </Button>
      </div>
    </Card>
  );
};
