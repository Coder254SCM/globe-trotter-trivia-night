import { supabase } from "@/integrations/supabase/client";

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  accepted_at?: string;
  requester_profile?: {
    username: string;
    avatar_url?: string;
  };
  addressee_profile?: {
    username: string;
    avatar_url?: string;
  };
}

export class FriendsService {
  static async sendFriendRequest(requesterId: string, username: string): Promise<{ error?: string }> {
    // First, find the user by username
    const { data: addressee, error: findError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (findError || !addressee) {
      return { error: 'User not found' };
    }

    if (addressee.id === requesterId) {
      return { error: 'Cannot send friend request to yourself' };
    }

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${requesterId},addressee_id.eq.${requesterId}`)
      .or(`requester_id.eq.${addressee.id},addressee_id.eq.${addressee.id}`)
      .single();

    if (existing) {
      return { error: 'Friendship already exists' };
    }

    const { error } = await supabase
      .from('friendships')
      .insert({
        requester_id: requesterId,
        addressee_id: addressee.id
      });

    if (error) {
      console.error('Error sending friend request:', error);
      return { error: error.message };
    }

    return {};
  }

  static async acceptFriendRequest(friendshipId: string): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('friendships')
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', friendshipId);

    if (error) {
      console.error('Error accepting friend request:', error);
      return { error: error.message };
    }

    return {};
  }

  static async declineFriendRequest(friendshipId: string): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) {
      console.error('Error declining friend request:', error);
      return { error: error.message };
    }

    return {};
  }

  static async getFriends(userId: string): Promise<Friendship[]> {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        requester_profile:user_profiles!requester_id(username, avatar_url),
        addressee_profile:user_profiles!addressee_id(username, avatar_url)
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching friends:', error);
      return [];
    }

    return data || [];
  }

  static async getPendingRequests(userId: string): Promise<Friendship[]> {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        requester_profile:user_profiles!requester_id(username, avatar_url),
        addressee_profile:user_profiles!addressee_id(username, avatar_url)
      `)
      .eq('addressee_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }

    return data || [];
  }

  static async removeFriend(friendshipId: string): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) {
      console.error('Error removing friend:', error);
      return { error: error.message };
    }

    return {};
  }

  static async getFriendLeaderboard(userId: string): Promise<any[]> {
    const friends = await this.getFriends(userId);
    const friendIds = friends.map(f => 
      f.requester_id === userId ? f.addressee_id : f.requester_id
    );

    if (friendIds.length === 0) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', friendIds)
      .order('total_score', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching friend leaderboard:', error);
      return [];
    }

    return data || [];
  }
}