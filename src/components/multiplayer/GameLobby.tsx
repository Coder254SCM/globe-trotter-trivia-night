import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Hash, Trophy, Play, LogOut, Check, X } from "lucide-react";
import { GameRoom, RoomParticipant } from "@/services/gameRoom/gameRoomService";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface GameLobbyProps {
  room: GameRoom;
  participants: RoomParticipant[];
  onReady: () => void;
  onLeave: () => void;
  onStart?: () => void;
  isHost?: boolean;
}

export const GameLobby = ({ 
  room, 
  participants, 
  onReady, 
  onLeave, 
  onStart,
  isHost 
}: GameLobbyProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, []);

  const currentParticipant = participants.find(p => p.player_id === currentUserId);
  const allReady = participants.every(p => p.is_ready);
  const canStart = isHost && allReady && participants.length >= 1;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Room Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                Game Lobby
              </h1>
              <p className="text-muted-foreground mt-1">
                Room Code: <span className="font-mono font-bold text-lg">{room.room_code}</span>
              </p>
            </div>
            <Badge variant={room.status === 'waiting' ? 'secondary' : 'default'}>
              {room.status === 'waiting' ? 'Waiting' : room.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Players</p>
                <p className="font-semibold">{room.current_players}/{room.max_players}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="font-semibold">{room.questions_per_game}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time/Question</p>
                <p className="font-semibold">{room.time_per_question}s</p>
              </div>
            </div>
            {room.difficulty_filter && (
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-semibold capitalize">{room.difficulty_filter}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Participants List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Players in Lobby
          </h2>
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div 
                key={participant.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium">
                    Player {participant.player_id.slice(0, 8)}
                    {participant.player_id === currentUserId && ' (You)'}
                    {participant.player_id === room.host_id && ' 👑'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {participant.is_ready ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Ready
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Not Ready
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-between">
          <Button 
            variant="outline" 
            onClick={onLeave}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Leave Room
          </Button>
          
          <div className="flex gap-3">
            <Button 
              onClick={onReady}
              variant={currentParticipant?.is_ready ? 'secondary' : 'default'}
              className="flex items-center gap-2"
            >
              {currentParticipant?.is_ready ? (
                <>
                  <X className="h-4 w-4" />
                  Not Ready
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Ready
                </>
              )}
            </Button>
            
            {isHost && onStart && (
              <Button 
                onClick={onStart}
                disabled={!canStart}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Game
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
