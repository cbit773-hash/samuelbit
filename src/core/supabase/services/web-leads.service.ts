import { supabase } from '../client';
import type { Lead } from '../database.types';

export interface LeadRegistrationFile {
  id: string;
  lead_id: string;
  storage_path: string;
  file_name: string;
  created_at: string;
}

export type WebLeadWithFile = Lead & { registration_file: LeadRegistrationFile | null };

function startOfTodayUtc(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Leads originados en /registro (source=web o notas legacy [WEB]) */
export async function getWebLeads(): Promise<WebLeadWithFile[]> {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .or('source.eq.web,notes.ilike.%[WEB]%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[WebLeads] getWebLeads', error);
    return [];
  }

  const list = (leads ?? []) as Lead[];
  if (list.length === 0) return [];

  const leadIds = list.map((l) => l.id);
  const { data: files } = await supabase
    .from('lead_registration_files')
    .select('*')
    .in('lead_id', leadIds);

  const fileByLead = new Map<string, LeadRegistrationFile>();
  for (const f of files ?? []) {
    fileByLead.set(f.lead_id, f as LeadRegistrationFile);
  }

  return list.map((l) => ({
    ...l,
    registration_file: fileByLead.get(l.id) ?? null,
  }));
}

export async function countWebLeadsToday(): Promise<number> {
  const since = startOfTodayUtc();
  const { count, error } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .or('source.eq.web,notes.ilike.%[WEB]%')
    .gte('created_at', since);

  if (error) {
    console.error('[WebLeads] countWebLeadsToday', error);
    return 0;
  }
  return count ?? 0;
}

export async function countUnassignedWebLeads(): Promise<number> {
  const { count, error } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .or('source.eq.web,notes.ilike.%[WEB]%')
    .is('assigned_to', null)
    .neq('status', 'Descartado');

  if (error) {
    console.error('[WebLeads] countUnassignedWebLeads', error);
    return 0;
  }
  return count ?? 0;
}

export async function getLeadExportSignedUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('lead-registrations')
    .createSignedUrl(storagePath, 60);

  if (error) {
    console.error('[WebLeads] signed URL', error);
    return null;
  }
  return data?.signedUrl ?? null;
}
