import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

interface RoomJoinerProps {
  onJoinRoom: (roomCode: string) => void;
  isLoading?: boolean;
}

export const RoomJoiner = ({ onJoinRoom, isLoading }: RoomJoinerProps) => {
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    if (roomCode.trim()) {
      onJoinRoom(roomCode.toUpperCase());
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LogIn className="h-6 w-6 text-primary" />
        Join Game Room
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="roomCode">Room Code</Label>
          <Input
            id="roomCode"
            placeholder="Enter 6-digit code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="mt-1 font-mono text-lg"
          />
        </div>

        <Button 
          onClick={handleJoin} 
          disabled={isLoading || roomCode.length !== 6}
          className="w-full"
        >
          <LogIn className="h-4 w-4 mr-2" />
          {isLoading ? 'Joining...' : 'Join Room'}
        </Button>
      </div>
    </Card>
  );
};
