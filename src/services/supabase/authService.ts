
import { supabase } from '@/integrations/supabase/client';

export class AuthService {
  static async signUp(email: string, password: string, username: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username
        }
      }
    });

    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async getUserRoles(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    return { data, error };
  }

  static async assignRole(userId: string, role: 'admin' | 'moderator' | 'user') {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    return { data, error };
  }

  static async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    return { data, error };
  }
}
