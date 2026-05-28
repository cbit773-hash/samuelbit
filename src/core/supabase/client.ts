import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ No se han encontrado las credenciales de Supabase en el archivo .env');
}

/**
 * Evita deadlocks del Web Locks API de GoTrue (React Strict Mode / varias pestañas).
 * Ver: https://github.com/supabase/supabase-js/issues/2111
 */
const authLockBypass = async <T>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<T>,
): Promise<T> => fn();

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      lock: authLockBypass,
    },
  },
);
