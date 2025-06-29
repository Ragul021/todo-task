import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  
  signIn: async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
  
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name || session.user.email!,
            avatar_url: session.user.user_metadata.avatar_url,
            created_at: session.user.created_at
          }
        });
      }
      
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.full_name || session.user.email!,
              avatar_url: session.user.user_metadata.avatar_url,
              created_at: session.user.created_at
            }
          });
        } else {
          set({ user: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ loading: false });
    }
  }
}));