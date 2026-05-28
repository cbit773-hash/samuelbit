// ============================================================
// INVESPRO — Servicio de call_logs (Twilio VoIP)
// ============================================================
import { supabase } from '../client';
import type { CallLog } from '../database.types';

/** Historial de llamadas del agente autenticado */
export async function getMyCallLogs(limit = 50): Promise<CallLog[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .eq('agent_id', user.id)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Calls] getMyCallLogs:', error);
    return [];
  }
  return (data || []) as CallLog[];
}

/** Buscar log por CallSid de Twilio */
export async function getCallLogBySid(callSid: string): Promise<CallLog | null> {
  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .eq('twilio_call_sid', callSid)
    .maybeSingle();

  if (error) {
    console.error('[Calls] getCallLogBySid:', error);
    return null;
  }
  return data as CallLog | null;
}
