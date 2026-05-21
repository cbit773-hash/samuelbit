// ============================================================
// INVESPRO — Servicio de Leads / CRM (Supabase)
// ============================================================
import { supabase } from '../client';
import type { Lead, LeadInsert, LeadUpdate, LeadStatus } from '../database.types';

/** Obtener todos los leads (para roles de liderazgo) */
export async function getAllLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*, assigned_profile:profiles!leads_assigned_to_fkey(id, full_name, email, role), created_by_profile:profiles!leads_created_by_fkey(id, full_name)')
    .order('created_at', { ascending: false });

  if (error) { 
    console.error('[Leads] Error fetching all leads:', error);
    // Fallback sin joins si hay error de permisos
    const { data: fallback } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    return (fallback || []) as Lead[];
  }
  return (data || []) as Lead[];
}

/** Obtener leads asignados al agente autenticado */
export async function getMyLeads(): Promise<Lead[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Leads] Error fetching my leads:', error); return []; }
  return (data || []) as Lead[];
}

/** Obtener leads por status */
export async function getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*, assigned_profile:profiles!leads_assigned_to_fkey(id, full_name, email)')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Leads] Error fetching by status:', error); return []; }
  return (data || []) as Lead[];
}

/** Obtener leads sin asignar */
export async function getUnassignedLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .is('assigned_to', null)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Leads] Error fetching unassigned:', error); return []; }
  return (data || []) as Lead[];
}

/** Crear un nuevo lead */
export async function createLead(lead: LeadInsert): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();

  if (error) { console.error('[Leads] Error creating lead:', error); return null; }
  return data as Lead;
}

/** Actualizar un lead */
export async function updateLead(id: string, updates: LeadUpdate): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) { console.error('[Leads] Error updating lead:', error); return null; }
  return data as Lead;
}

/** Reasignar lead a otro agente */
export async function reassignLead(leadId: string, agentId: string): Promise<Lead | null> {
  return updateLead(leadId, { assigned_to: agentId });
}

/** Contar leads por estado (para KPIs) */
export async function countLeadsByStatus(): Promise<Record<string, number>> {
  const leads = await getAllLeads();
  const counts: Record<string, number> = {};
  leads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
  return counts;
}

/** Contar total de leads */
export async function countLeads(): Promise<number> {
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (error) { console.error('[Leads] Error counting leads:', error); return 0; }
  return count || 0;
}
