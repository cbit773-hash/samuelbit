import { create } from 'zustand';
import type { AuthError, Session } from '@supabase/supabase-js';
import { supabase } from '../../../core/supabase/client';
import type { ClientOnboardingResult } from '../../../core/supabase/database.types';
import { isDemoUserId } from '../../../core/supabase/demo-ids';
import { processWebLead } from '../../../core/supabase/services/web-lead-processing.service';
import { mapPasswordUpdateError } from '../../../shared/utils/auth-errors';

export type Role = 'CLIENT' | 'AGENT' | 'TEAM_LEADER' | 'FLOOR_MANAGER' | 'MANAGER' | 'CHIEF' | 'HEAD';

const VALID_ROLES: Role[] = [
  'CLIENT', 'AGENT', 'TEAM_LEADER', 'FLOOR_MANAGER', 'MANAGER', 'CHIEF', 'HEAD',
];

export interface RegisterClientPayload {
  email: string;
  password: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  interest?: string;
  utmNotes?: string | null;
}

export interface RegisterClientResult {
  leadId: string | null;
}

interface AuthState {
  user: any | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: Role) => Promise<void>;
  registerClient: (payload: RegisterClientPayload) => Promise<RegisterClientResult>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string, options?: { currentPassword?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

let authListenerAttached = false;

function appBaseUrl(): string {
  return import.meta.env.VITE_APP_URL || window.location.origin;
}

function parseRole(value: string | null | undefined): Role | null {
  if (!value) return null;
  return VALID_ROLES.includes(value as Role) ? (value as Role) : null;
}

function logAuthError(context: string, message: string) {
  if (message.includes('permission denied')) {
    console.error(
      `[InvestPRO Auth] ${context}: ${message} — Sin JWT válido o sesión expirada. Revisa login y .env.`,
    );
  } else if (message.includes('PGRST116') || message.includes('0 rows')) {
    console.warn(`[InvestPRO Auth] ${context}: sin fila en profiles — se intentará ensure_my_profile.`);
  } else {
    console.error(`[InvestPRO Auth] ${context}:`, message);
  }
}

async function fetchUserRole(userId: string): Promise<Role> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return 'CLIENT';
  }

  const { data: rpcRole, error: rpcError } = await supabase.rpc('get_auth_role');
  if (!rpcError) {
    const role = parseRole(rpcRole as string);
    if (role) return role;
  } else {
    logAuthError('get_auth_role', rpcError.message);
  }

  const { error: ensureError } = await supabase.rpc('ensure_my_profile');
  if (ensureError) {
    logAuthError('ensure_my_profile', ensureError.message);
  }

  const { data: rpcRole2, error: rpcError2 } = await supabase.rpc('get_auth_role');
  if (!rpcError2) {
    const role = parseRole(rpcRole2 as string);
    if (role) return role;
  }

  const { data: profile, error: selError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (!selError && profile?.role) {
    return parseRole(profile.role as string) ?? 'CLIENT';
  }

  if (selError) {
    logAuthError('profiles.select role', selError.message);
  }

  return 'CLIENT';
}

async function fetchClientBlocked(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_blocked')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    logAuthError('profiles.is_blocked', error.message);
    return false;
  }
  return data?.is_blocked === true;
}

async function applySession(session: Session | null) {
  if (!session?.user || !session.access_token) {
    return { user: null, role: null, isAuthenticated: false };
  }

  const role = await fetchUserRole(session.user.id);

  if (role === 'CLIENT' && (await fetchClientBlocked(session.user.id))) {
    await supabase.auth.signOut();
    return { user: null, role: null, isAuthenticated: false };
  }

  return {
    user: session.user,
    role,
    isAuthenticated: true,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && isDemoUserId(session.user.id)) {
      await supabase.auth.signOut();
      set({ user: null, role: null, isAuthenticated: false, isLoading: false });
      return;
    }
    const state = await applySession(session);
    set({ ...state, isLoading: false });

    if (!authListenerAttached) {
      authListenerAttached = true;
      // No await aquí: bloquear el callback congela signInWithPassword (queda "Conectando...")
      supabase.auth.onAuthStateChange((event, session) => {
        if (!session?.access_token) {
          if (event === 'SIGNED_OUT') {
            set({ user: null, role: null, isAuthenticated: false, isLoading: false });
          }
          return;
        }

        void applySession(session).then((next) => {
          set({ ...next, isLoading: false });
        });
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session) {
        throw new Error('No se recibió sesión tras el login. Revisa Confirm email en Supabase Auth.');
      }
      const next = await applySession(data.session);
      if (!next.isAuthenticated) {
        throw new Error('Tu cuenta está suspendida. Contacta a soporte.');
      }
      set({ ...next, isLoading: false });
      console.log(`[InvestPRO Auth] Sesión Supabase: ${data.session.user.email}`);
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  signUp: async (email, password, full_name, role) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role } },
    });
    if (error) {
      set({ isLoading: false });
      throw error;
    }

    if (data?.user) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.rpc('ensure_my_profile');
        const next = await applySession(session);
        set({ ...next, isLoading: false });
        return;
      }
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name,
        role,
      });
    }
    set({ isLoading: false });
  },

  registerClient: async (payload) => {
    set({ isLoading: true });
    const first_name = payload.firstName.trim() || 'Usuario';
    const last_name = payload.lastName.trim() || '';

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: { data: { full_name: payload.fullName } },
    });
    if (error) {
      set({ isLoading: false });
      throw error;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (signInError) {
        set({ isLoading: false });
        throw signInError;
      }
    }

    const userId = data.user?.id ?? (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      set({ isLoading: false });
      throw new Error('No se pudo crear la sesión del usuario');
    }

    const { data: onboarding, error: rpcError } = await supabase.rpc('complete_client_onboarding', {
      p_payload: {
        first_name,
        last_name,
        phone: payload.phone,
        country: payload.country,
        interest: payload.interest ?? 'Desconocido',
        utm_notes: payload.utmNotes ?? null,
      },
    });
    if (rpcError) {
      set({ isLoading: false });
      throw rpcError;
    }

    const result = onboarding as ClientOnboardingResult | null;
    const leadId = result?.lead_id ?? null;
    if (leadId) {
      void processWebLead(leadId).catch((e) => {
        console.warn('[InvestPRO Auth] process-web-lead:', e);
      });
    }

    await supabase.rpc('ensure_my_profile');
    const { data: { session } } = await supabase.auth.getSession();
    const next = await applySession(session);
    set({ ...next, isLoading: false });
    return { leadId };
  },

  requestPasswordReset: async (email) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appBaseUrl()}/auth/restablecer`,
    });
    set({ isLoading: false });
    if (error) throw error;
  },

  updatePassword: async (password, options) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No hay sesión activa. Inicia sesión o vuelve a abrir el enlace de recuperación.');
    }

    const payload: { password: string; current_password?: string } = { password };
    if (options?.currentPassword) {
      payload.current_password = options.currentPassword;
    }

    const attempt = async () => supabase.auth.updateUser(payload);

    let { error } = await attempt();
    if (error?.message?.includes('lock:') || error?.message?.includes('Lock "')) {
      await new Promise((r) => setTimeout(r, 400));
      ({ error } = await attempt());
    }
    if (error) {
      throw new Error(mapPasswordUpdateError(error as AuthError));
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, role: null, isAuthenticated: false, isLoading: false });
  },
}));
