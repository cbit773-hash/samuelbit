import { create } from 'zustand';
import { supabase } from '../../../core/supabase/client';

export type Role = 'CLIENT' | 'AGENT' | 'TEAM_LEADER' | 'FLOOR_MANAGER' | 'MANAGER' | 'CHIEF' | 'HEAD';

interface AuthState {
  user: any | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  loginAsDemo: (role: Role) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      set({ user: session.user, role: profile?.role || 'CLIENT', isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, role: null, isAuthenticated: false, isLoading: false });
    }
    
    // Escuchar cambios (login, logout)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        set({ user: session.user, role: profile?.role || 'CLIENT', isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, role: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  // Demo login: modo simulación local — NO requiere Supabase
  // Establece el estado directamente para pruebas rápidas de la UI por rol
  loginAsDemo: async (role: Role) => {
    set({ isLoading: true });
    const email = `${role.toLowerCase().replace('_', '')}@investpro.com`;

    // Simular un pequeño delay de conexión para UX
    await new Promise(res => setTimeout(res, 300));

    set({
      user: { id: `demo-${role}`, email, user_metadata: { full_name: `Demo ${role}` } },
      role,
      isAuthenticated: true,
      isLoading: false,
    });

    console.log(`[InvestPRO Auth] ✅ Sesión demo activa como: ${role}`);
  },

  login: async (email, password) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false });
      throw error;
    }
    // Profile is fetched in onAuthStateChange
  },

  signUp: async (email, password, full_name, role) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } }
    });
    if (error) {
      set({ isLoading: false });
      throw error;
    }
    
    if (data?.user) {
      await new Promise(res => setTimeout(res, 800)); // wait for trigger
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name,
        role
      });
    }
    set({ isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
  }
}));
