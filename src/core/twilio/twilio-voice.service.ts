// ============================================================
// INVESPRO — Twilio Voice (client → Edge Function)
// Credenciales Twilio solo en servidor.
// ============================================================

import { supabase } from '../supabase/client';

interface TokenResponse {
  token: string;
  identity: string;
  error?: string;
}

export async function fetchVoiceToken(): Promise<
  { token: string; identity: string } | { error: string }
> {
  const { data, error } = await supabase.functions.invoke('twilio-voice-token', {
    body: {},
  });

  if (error) {
    console.error('[twilio-voice-token]', error);
    return { error: error.message || 'No se pudo obtener el token de voz' };
  }

  const payload = data as TokenResponse;
  if (payload?.error) return { error: payload.error };
  if (!payload?.token) return { error: 'Respuesta inválida del servidor' };

  return { token: payload.token, identity: payload.identity };
}
