import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface GameRoom {
  id: string;
  host_id: string;
  room_code: string;
  status: 'waiting' | 'active' | 'completed';
  max_players: number;
  current_players: number;
  questions_per_game: number;
  time_per_question: number;
  country_filter?: string;
  difficulty_filter?: string;
  settings: Record<string, any>;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  player_id: string;
  joined_at: string;
  current_score: number;
  current_rank: number;
  is_ready: boolean;
  is_connected: boolean;
}

export class GameRoomService {
  private static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async createRoom(
    hostId: string,
    settings: {
      maxPlayers?: number;
      questionsPerGame?: number;
      timePerQuestion?: number;
      countryFilter?: string;
      difficultyFilter?: string;
    } = {}
  ): Promise<{ room: GameRoom | null; error?: string }> {
    const roomCode = this.generateRoomCode();
    
    const { data, error } = await supabase
      .from('game_rooms')
      .insert({
        host_id: hostId,
        room_code: roomCode,
        max_players: settings.maxPlayers || 50,
        questions_per_game: settings.questionsPerGame || 10,
        time_per_question: settings.timePerQuestion || 30,
        country_filter: settings.countryFilter,
        difficulty_filter: settings.difficultyFilter,
        status: 'waiting',
        current_players: 0,
        settings: settings
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      return { room: null, error: error.message };
    }

    return { room: data as GameRoom };
  }

  static async joinRoom(
    roomCode: string,
    playerId: string
  ): Promise<{ participant: RoomParticipant | null; room: GameRoom | null; error?: string }> {
    // First, get the room
    const { data: room, error: roomError } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('room_code', roomCode)
      .eq('status', 'waiting')
      .single();

    if (roomError || !room) {
      return { participant: null, room: null, error: 'Room not found or already started' };
    }

    const gameRoom = room as GameRoom;

    if (gameRoom.current_players >= gameRoom.max_players) {
      return { participant: null, room: null, error: 'Room is full' };
    }

    // Add participant
    const { data: participant, error: participantError } = await supabase
      .from('room_participants')
      .insert({
        room_id: gameRoom.id,
        player_id: playerId,
        current_score: 0,
        current_rank: 0,
        is_ready: false,
        is_connected: true
      })
      .select()
      .single();

    if (participantError) {
      console.error('Error joining room:', participantError);
      return { participant: null, room: null, error: participantError.message };
    }

    // Update player count
    await supabase
      .from('game_rooms')
      .update({ current_players: gameRoom.current_players + 1 })
      .eq('id', gameRoom.id);

    return { participant, room: gameRoom };
  }

  static async leaveRoom(
    roomId: string,
    playerId: string
  ): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('room_participants')
      .delete()
      .eq('room_id', roomId)
      .eq('player_id', playerId);

    if (error) {
      console.error('Error leaving room:', error);
      return { error: error.message };
    }

    // Update player count
    const { data: room } = await supabase
      .from('game_rooms')
      .select('current_players')
      .eq('id', roomId)
      .single();

    if (room) {
      await supabase
        .from('game_rooms')
        .update({ current_players: Math.max(0, room.current_players - 1) })
        .eq('id', roomId);
    }

    return {};
  }

  static async getRoomByCode(roomCode: string): Promise<GameRoom | null> {
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('room_code', roomCode)
      .single();

    if (error) {
      console.error('Error getting room:', error);
      return null;
    }

    return data as GameRoom;
  }

  static async getRoomParticipants(roomId: string): Promise<RoomParticipant[]> {
    const { data, error } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', roomId)
      .order('current_score', { ascending: false });

    if (error) {
      console.error('Error getting participants:', error);
      return [];
    }

    return data || [];
  }

  static async updateParticipantReady(
    roomId: string,
    playerId: string,
    isReady: boolean
  ): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('room_participants')
      .update({ is_ready: isReady })
      .eq('room_id', roomId)
      .eq('player_id', playerId);

    if (error) {
      console.error('Error updating ready status:', error);
      return { error: error.message };
    }

    return {};
  }

  static async startGame(roomId: string): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('game_rooms')
      .update({ 
        status: 'active',
        started_at: new Date().toISOString()
      })
      .eq('id', roomId);

    if (error) {
      console.error('Error starting game:', error);
      return { error: error.message };
    }

    return {};
  }

  static subscribeToRoom(
    roomId: string,
    onRoomUpdate: (room: GameRoom) => void,
    onParticipantUpdate: (participants: RoomParticipant[]) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            onRoomUpdate(payload.new as GameRoom);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `room_id=eq.${roomId}`
        },
        async () => {
          const participants = await GameRoomService.getRoomParticipants(roomId);
          onParticipantUpdate(participants);
        }
      )
      .subscribe();

    return channel;
  }
}
