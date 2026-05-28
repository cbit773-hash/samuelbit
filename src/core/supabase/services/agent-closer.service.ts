// ============================================================
// INVESPRO — Servicios AGENT (Closer): presencia, SOS, callbacks, ranking
// ============================================================
import { supabase } from '../client';
import type {
  AgentPresence,
  LeadCallback,
  SosAlert,
  TeamLeaderboardRow,
} from '../database.types';

export async function setMyWorkStatus(
  status: AgentPresence,
  note?: string,
): Promise<boolean> {
  const { error } = await supabase.rpc('set_my_work_status', {
    p_status: status,
    p_note: note ?? null,
  });
  if (error) {
    console.error('[AgentCloser] setMyWorkStatus:', error);
    return false;
  }
  return true;
}

export async function scheduleCallback(
  leadId: string,
  scheduledAt: string,
  reason?: string,
): Promise<string | null> {
  const { data, error } = await supabase.rpc('agent_schedule_callback', {
    p_lead_id: leadId,
    p_scheduled_at: scheduledAt,
    p_reason: reason ?? null,
  });
  if (error) {
    console.error('[AgentCloser] scheduleCallback:', error);
    return null;
  }
  return data as string;
}

export async function getMyCallbacks(): Promise<LeadCallback[]> {
  const { data, error } = await supabase.rpc('agent_list_my_callbacks');
  if (error) {
    console.error('[AgentCloser] getMyCallbacks:', error);
    return [];
  }
  return (data || []) as LeadCallback[];
}

export async function raiseSos(leadId?: string, message?: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('agent_raise_sos', {
    p_lead_id: leadId ?? null,
    p_message: message ?? null,
  });
  if (error) {
    console.error('[AgentCloser] raiseSos:', error);
    return null;
  }
  return data as string;
}

export async function ackSos(sosId: string): Promise<boolean> {
  const { error } = await supabase.rpc('supervisor_ack_sos', { p_sos_id: sosId });
  if (error) {
    console.error('[AgentCloser] ackSos:', error);
    return false;
  }
  return true;
}

export async function getTeamLeaderboard(days = 30): Promise<TeamLeaderboardRow[]> {
  const { data, error } = await supabase.rpc('agent_team_leaderboard', { p_days: days });
  if (error) {
    console.error('[AgentCloser] getTeamLeaderboard:', error);
    return [];
  }
  return (data || []) as TeamLeaderboardRow[];
}

export async function getOpenSosAlerts(teamId?: string | null): Promise<SosAlert[]> {
  let query = supabase
    .from('sos_alerts')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(20);

  if (teamId) {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[AgentCloser] getOpenSosAlerts:', error);
    return [];
  }
  return (data || []) as SosAlert[];
}

export async function getTeamPresence(teamId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, work_status, work_status_since, role')
    .eq('team_id', teamId)
    .eq('role', 'AGENT')
    .order('full_name');

  if (error) {
    console.error('[AgentCloser] getTeamPresence:', error);
    return [];
  }
  return data || [];
}

export async function agentCreateDepositForClient(params: {
  clientId: string;
  amount: number;
  leadId?: string;
  notes?: string;
}): Promise<{ transactionId: string } | { error: string }> {
  const { data, error } = await supabase.rpc('agent_create_deposit_transaction', {
    p_client_id: params.clientId,
    p_amount: params.amount,
    p_payment_method: 'usdttrc20',
    p_gateway: 'nowpayments',
    p_notes: params.notes ?? null,
    p_lead_id: params.leadId ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  const row = data as { transaction_id: string };
  return { transactionId: row.transaction_id };
}
