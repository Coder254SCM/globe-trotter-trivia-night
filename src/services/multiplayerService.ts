import { supabase } from "@/integrations/supabase/client";

export interface MultiplayerSession {
  id: string;
  host_id: string;
  room_code: string;
  status: 'waiting' | 'active' | 'completed';
  max_players: number;
  current_players: number;
  questions_per_round: number;
  time_per_question: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

export interface MultiplayerParticipant {
  id: string;
  session_id: string;
  user_id: string;
  joined_at: string;
  current_score: number;
  current_position: number;
  is_ready: boolean;
  username?: string;
}

export class MultiplayerService {
  static async createSession(
    hostId: string,
    maxPlayers: number = 8,
    questionsPerRound: number = 10,
    timePerQuestion: number = 30
  ): Promise<{ session: MultiplayerSession | null; roomCode: string; error?: string }> {
    // Generate unique room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('multiplayer_sessions')
      .insert({
        host_id: hostId,
        room_code: roomCode,
        max_players: maxPlayers,
        questions_per_round: questionsPerRound,
        time_per_question: timePerQuestion,
        current_players: 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating multiplayer session:', error);
      return { session: null, roomCode: '', error: error.message };
    }

    // Host joins their own session
    await this.joinSession(data.id, hostId);

    return { session: data as MultiplayerSession, roomCode };
  }

  static async joinSession(sessionId: string, userId: string): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('multiplayer_participants')
      .insert({
        session_id: sessionId,
        user_id: userId
      });

    if (error) {
      console.error('Error joining session:', error);
      return { error: error.message };
    }

    // Update participant count - get current count and increment
    const { data: session } = await supabase
      .from('multiplayer_sessions')
      .select('current_players')
      .eq('id', sessionId)
      .single();
    
    if (session) {
      await supabase
        .from('multiplayer_sessions')
        .update({ current_players: session.current_players + 1 })
        .eq('id', sessionId);
    }

    return {};
  }

  static async leaveSession(sessionId: string, userId: string): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('multiplayer_participants')
      .delete()
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving session:', error);
      return { error: error.message };
    }

    // Update participant count - get current count and decrement
    const { data: session } = await supabase
      .from('multiplayer_sessions')
      .select('current_players')
      .eq('id', sessionId)
      .single();
    
    if (session) {
      await supabase
        .from('multiplayer_sessions')
        .update({ current_players: Math.max(0, session.current_players - 1) })
        .eq('id', sessionId);
    }

    return {};
  }

  static async getSessionByCode(roomCode: string): Promise<MultiplayerSession | null> {
    const { data, error } = await supabase
      .from('multiplayer_sessions')
      .select('*')
      .eq('room_code', roomCode)
      .eq('status', 'waiting')
      .single();

    if (error) {
      console.error('Error finding session:', error);
      return null;
    }

    return data as MultiplayerSession;
  }

  static async getSessionParticipants(sessionId: string): Promise<MultiplayerParticipant[]> {
    const { data, error } = await supabase
      .from('multiplayer_participants')
      .select(`
        *,
        user_profiles!inner(username)
      `)
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error getting participants:', error);
      return [];
    }

    return data.map(participant => ({
      ...participant,
      username: participant.user_profiles?.username || 'Anonymous'
    }));
  }

  static async updateSessionStatus(sessionId: string, status: 'waiting' | 'active' | 'completed'): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('multiplayer_sessions')
      .update({ 
        status,
        started_at: status === 'active' ? new Date().toISOString() : undefined,
        ended_at: status === 'completed' ? new Date().toISOString() : undefined
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session status:', error);
      return { error: error.message };
    }

    return {};
  }

  static async updateParticipantScore(sessionId: string, userId: string, score: number): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('multiplayer_participants')
      .update({ current_score: score })
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating participant score:', error);
      return { error: error.message };
    }

    return {};
  }

  static subscribeToSessionUpdates(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`multiplayer_session_${sessionId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'multiplayer_sessions', filter: `id=eq.${sessionId}` },
        callback
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'multiplayer_participants', filter: `session_id=eq.${sessionId}` },
        callback
      )
      .subscribe();
  }
}