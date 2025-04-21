import { supabase } from './supabase';
import { create } from 'zustand';
import audioFeedback from './audio';

interface AuthState {
  user: any | null;
  isDriver: boolean;
  isAdmin: boolean;
  setUser: (user: any | null) => void;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isDriver: false,
  isAdmin: false,
  setUser: (user) => {
    if (user) {
      audioFeedback.welcomeUser(user.user_metadata?.name || 'User');
    }
    set({ 
      user,
      isDriver: user?.user_metadata?.is_driver || false,
      isAdmin: user?.user_metadata?.role === 'admin' || false,
    });
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    const userName = data.user?.user_metadata?.name || 'User';
    audioFeedback.welcomeUser(userName);
    
    set({ 
      user: data.user,
      isDriver: data.user?.user_metadata?.is_driver || false,
      isAdmin: data.user?.user_metadata?.role === 'admin' || false,
    });
    return data;
  },
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          is_driver: userData.isDriver,
          role: 'user',
        },
      },
    });
    if (error) throw error;
    
    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email,
          name: userData.name,
          phone: userData.phone,
          is_driver: userData.isDriver,
          role: 'user',
        }]);
      if (profileError) throw profileError;

      if (userData.isDriver) {
        audioFeedback.driverRegistered();
      } else {
        audioFeedback.welcomeUser(userData.name);
      }
    }
    
    return data;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, isDriver: false, isAdmin: false });
  },
}));