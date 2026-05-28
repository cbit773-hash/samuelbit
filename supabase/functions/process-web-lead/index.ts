import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient } from '../_shared/supabase-admin.ts';
import { notifyWebLeadRegistered } from '../_shared/notifications.ts';

const BUCKET = 'lead-registrations';
const MAX_AGE_MS = 10 * 60 * 1000;

function csvEscape(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildLeadCsv(lead: Record<string, unknown>, profileEmail: string | null): string {
  const headers = [
    'fecha_registro',
    'nombre',
    'apellido',
    'email',
    'telefono',
    'pais',
    'interes',
    'notas_utm',
    'lead_id',
    'client_user_id',
    'email_perfil',
  ];
  const row = [
    lead.created_at,
    lead.first_name,
    lead.last_name,
    lead.email,
    lead.phone,
    lead.country,
    lead.interest,
    lead.notes,
    lead.id,
    lead.client_user_id,
    profileEmail,
  ];
  return '\uFEFF' + headers.map(csvEscape).join(',') + '\r\n' + row.map(csvEscape).join(',') + '\r\n';
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: { lead_id?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const leadId = body.lead_id?.trim();
  if (!leadId) {
    return jsonResponse({ error: 'lead_id required' }, 400);
  }

  const appUrl = (Deno.env.get('APP_URL') ?? 'http://localhost:5173').replace(/\/$/, '');
  const admin = createAdminClient();

  const { data: lead, error: leadError } = await admin
    .from('leads')
    .select('id, first_name, last_name, phone, email, country, interest, notes, source, client_user_id, created_at')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    return jsonResponse({ error: 'Lead not found' }, 404);
  }

  if (lead.source !== 'web') {
    return jsonResponse({ error: 'Not a web registration lead' }, 400);
  }

  const createdAt = new Date(lead.created_at as string).getTime();
  if (Date.now() - createdAt > MAX_AGE_MS) {
    return jsonResponse({ error: 'Lead registration window expired' }, 400);
  }

  let profileEmail: string | null = null;
  if (lead.client_user_id) {
    const { data: profile } = await admin
      .from('profiles')
      .select('email')
      .eq('id', lead.client_user_id)
      .single();
    profileEmail = (profile?.email as string) ?? null;
  }

  const dateFolder = (lead.created_at as string).slice(0, 10);
  const fileName = `registro-${leadId}.csv`;
  const storagePath = `${dateFolder}/${leadId}.csv`;
  const csvContent = buildLeadCsv(lead as Record<string, unknown>, profileEmail);

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, new Blob([csvContent], { type: 'text/csv;charset=utf-8' }), {
      upsert: true,
      contentType: 'text/csv',
    });

  if (uploadError) {
    console.error('[process-web-lead] upload', uploadError.message);
    return jsonResponse({ error: 'Failed to store CSV', detail: uploadError.message }, 500);
  }

  const { error: fileRowError } = await admin.from('lead_registration_files').upsert(
    {
      lead_id: leadId,
      storage_path: storagePath,
      file_name: fileName,
    },
    { onConflict: 'lead_id', ignoreDuplicates: false }
  );

  if (fileRowError) {
    console.error('[process-web-lead] lead_registration_files', fileRowError.message);
  }

  try {
    await notifyWebLeadRegistered(admin, appUrl, {
      id: lead.id as string,
      first_name: lead.first_name as string,
      last_name: lead.last_name as string,
      phone: lead.phone as string,
      email: lead.email as string | null,
      country: lead.country as string | null,
      interest: lead.interest as string,
      notes: lead.notes as string | null,
      client_user_id: lead.client_user_id as string | null,
      created_at: lead.created_at as string,
    });
  } catch (e) {
    console.warn('[process-web-lead] notify staff', e);
  }

  return jsonResponse({
    ok: true,
    lead_id: leadId,
    storage_path: storagePath,
    file_name: fileName,
  });
});
