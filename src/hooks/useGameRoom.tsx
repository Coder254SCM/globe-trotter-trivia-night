import { useState, useEffect, useCallback } from 'react';
import { GameRoomService, GameRoom, RoomParticipant } from '@/services/gameRoom/gameRoomService';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useGameRoom = (roomId?: string) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { toast } = useToast();

  const createRoom = useCallback(async (settings?: {
    maxPlayers?: number;
    questionsPerGame?: number;
    timePerQuestion?: number;
    countryFilter?: string;
    difficultyFilter?: string;
  }) => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a room',
        variant: 'destructive'
      });
      setIsLoading(false);
      return null;
    }

    const { room: newRoom, error } = await GameRoomService.createRoom(user.id, settings);
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
      return null;
    }

    setRoom(newRoom);
    toast({
      title: 'Room Created!',
      description: `Room code: ${newRoom?.room_code}`
    });
    
    return newRoom;
  }, [toast]);

  const joinRoom = useCallback(async (roomCode: string) => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to join a room',
        variant: 'destructive'
      });
      setIsLoading(false);
      return null;
    }

    const { participant, room: joinedRoom, error } = await GameRoomService.joinRoom(roomCode, user.id);
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
      return null;
    }

    setRoom(joinedRoom);
    toast({
      title: 'Joined Room!',
      description: `You've joined room ${roomCode}`
    });
    
    return { participant, room: joinedRoom };
  }, [toast]);

  const leaveRoom = useCallback(async () => {
    if (!room) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await GameRoomService.leaveRoom(room.id, user.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    setRoom(null);
    setParticipants([]);
  }, [room, toast]);

  const toggleReady = useCallback(async () => {
    if (!room) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentParticipant = participants.find(p => p.player_id === user.id);
    const newReadyState = !currentParticipant?.is_ready;

    const { error } = await GameRoomService.updateParticipantReady(
      room.id,
      user.id,
      newReadyState
    );
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
    }
  }, [room, participants, toast]);

  const startGame = useCallback(async () => {
    if (!room) return;
    
    const { error } = await GameRoomService.startGame(room.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Game Started!',
      description: 'The quiz is beginning...'
    });
  }, [room, toast]);

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return;

    const newChannel = GameRoomService.subscribeToRoom(
      roomId,
      (updatedRoom) => setRoom(updatedRoom),
      (updatedParticipants) => setParticipants(updatedParticipants)
    );

    setChannel(newChannel);

    // Initial load
    GameRoomService.getRoomParticipants(roomId).then(setParticipants);

    return () => {
      newChannel.unsubscribe();
    };
  }, [roomId]);

  return {
    room,
    participants,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    startGame
  };
};
