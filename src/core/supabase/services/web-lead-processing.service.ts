// ============================================================
// INVESPRO — Post-registro web: CSV Storage + email staff
// ============================================================

import { supabase } from '../client';

interface ProcessWebLeadResponse {
  ok?: boolean;
  lead_id?: string;
  storage_path?: string;
  file_name?: string;
  error?: string;
}

/**
 * Genera CSV en Storage y notifica staff. Fire-and-forget desde registro;
 * no bloquea la UX si falla (lead + notificación in-app ya existen vía RPC).
 */
export async function processWebLead(leadId: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke<ProcessWebLeadResponse>('process-web-lead', {
    body: { lead_id: leadId },
  });

  if (error) {
    console.warn('[process-web-lead]', error.message ?? error);
    return;
  }

  if (data?.error) {
    console.warn('[process-web-lead]', data.error);
  }
}
