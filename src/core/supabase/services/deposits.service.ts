// ============================================================
// INVESPRO — Servicio de Depósitos (Supabase)
// ============================================================
import { supabase } from '../client';
import type { Deposit, DepositInsert, DepositUpdate, DepositStatus } from '../database.types';

/** Obtener todos los depósitos (Alta Dirección) */
export async function getAllDeposits(): Promise<Deposit[]> {
  const { data, error } = await supabase
    .from('deposits')
    .select('*, client_profile:profiles!deposits_client_id_fkey(id, full_name, email), agent_profile:profiles!deposits_agent_id_fkey(id, full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Deposits] Error fetching all deposits:', error);
    const { data: fallback } = await supabase.from('deposits').select('*').order('created_at', { ascending: false });
    return (fallback || []) as Deposit[];
  }
  return (data || []) as Deposit[];
}

/** Obtener depósitos del cliente autenticado */
export async function getMyDeposits(): Promise<Deposit[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('deposits')
    .select('*, agent_profile:profiles!deposits_agent_id_fkey(id, full_name)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Deposits] Error fetching my deposits:', error); return []; }
  return (data || []) as Deposit[];
}

/** Obtener depósitos cerrados por un agente */
export async function getDepositsByAgent(agentId: string): Promise<Deposit[]> {
  const { data, error } = await supabase
    .from('deposits')
    .select('*, client_profile:profiles!deposits_client_id_fkey(id, full_name)')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Deposits] Error fetching agent deposits:', error); return []; }
  return (data || []) as Deposit[];
}

/** Obtener depósitos por estado */
export async function getDepositsByStatus(status: DepositStatus): Promise<Deposit[]> {
  const { data, error } = await supabase
    .from('deposits')
    .select('*, client_profile:profiles!deposits_client_id_fkey(id, full_name, email), agent_profile:profiles!deposits_agent_id_fkey(id, full_name)')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Deposits] Error fetching by status:', error); return []; }
  return (data || []) as Deposit[];
}

/** Crear un nuevo depósito */
export async function createDeposit(deposit: DepositInsert): Promise<Deposit | null> {
  const { data, error } = await supabase
    .from('deposits')
    .insert(deposit)
    .select()
    .single();

  if (error) { console.error('[Deposits] Error creating deposit:', error); return null; }
  return data as Deposit;
}

/** Actualizar estado de un depósito (aprobar/rechazar) */
export async function updateDeposit(id: string, updates: DepositUpdate): Promise<Deposit | null> {
  const { data, error } = await supabase
    .from('deposits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) { console.error('[Deposits] Error updating deposit:', error); return null; }
  return data as Deposit;
}

/** Aprobar un depósito */
export async function approveDeposit(id: string): Promise<Deposit | null> {
  return updateDeposit(id, { status: 'Aprobado' });
}

/** Rechazar un depósito */
export async function rejectDeposit(id: string): Promise<Deposit | null> {
  return updateDeposit(id, { status: 'Rechazado' });
}

/** KPIs de depósitos */
export async function getDepositKPIs(): Promise<{
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  totalVolume: number;
  ftdCount: number;
  retentionVolume: number;
}> {
  const deposits = await getAllDeposits();
  return {
    total: deposits.length,
    approved: deposits.filter(d => d.status === 'Aprobado').length,
    pending: deposits.filter(d => d.status === 'Verificando').length,
    rejected: deposits.filter(d => d.status === 'Rechazado').length,
    totalVolume: deposits.filter(d => d.status === 'Aprobado').reduce((sum, d) => sum + Number(d.amount), 0),
    ftdCount: deposits.filter(d => d.type === 'FTD' && d.status === 'Aprobado').length,
    retentionVolume: deposits.filter(d => d.type === 'RETENCION' && d.status === 'Aprobado').reduce((sum, d) => sum + Number(d.amount), 0),
  };
}
