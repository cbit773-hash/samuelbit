import { supabase } from '../client';
import type { KycDocument, KycDocumentType, KycStatus, Profile } from '../database.types';

const BUCKET = 'kyc-documents';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export const KYC_REQUIRED_DOCS: { type: KycDocumentType; label: string; hint: string }[] = [
  { type: 'id_front', label: 'Documento (frente)', hint: 'Cédula, pasaporte o DNI — foto legible' },
  { type: 'id_back', label: 'Documento (reverso)', hint: 'Reverso del mismo documento' },
  { type: 'proof_of_address', label: 'Comprobante de domicilio', hint: 'Factura o extracto < 3 meses' },
  { type: 'selfie', label: 'Selfie con documento', hint: 'Tu rostro sosteniendo el ID' },
];

export const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  none: 'Sin iniciar',
  pending: 'En preparación',
  submitted: 'En revisión',
  verified: 'Verificado',
  rejected: 'Rechazado',
};

export const KYC_STATUS_COLORS: Record<KycStatus, string> = {
  none: 'text-muted',
  pending: 'text-brand400',
  submitted: 'text-brand',
  verified: 'text-emerald-400',
  rejected: 'text-rose-400',
};

export async function getMyKycProfile(): Promise<Pick<
  Profile,
  'id' | 'kyc_status' | 'kyc_submitted_at' | 'kyc_reviewed_at' | 'kyc_rejection_reason' | 'full_name'
> | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, kyc_status, kyc_submitted_at, kyc_reviewed_at, kyc_rejection_reason, full_name')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('[KYC] profile', error);
    return null;
  }
  return data as Pick<Profile, 'id' | 'kyc_status' | 'kyc_submitted_at' | 'kyc_reviewed_at' | 'kyc_rejection_reason' | 'full_name'>;
}

export async function getMyKycDocuments(): Promise<KycDocument[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('kyc_documents')
    .select('*')
    .eq('client_id', user.id)
    .order('document_type');

  if (error) {
    console.error('[KYC] documents', error);
    return [];
  }
  return (data ?? []) as KycDocument[];
}

export async function uploadKycDocument(
  file: File,
  documentType: KycDocumentType
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sesión requerida' };

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Formato no permitido. Usa JPG, PNG, WEBP o PDF.' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'Archivo máximo 5 MB.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const storagePath = `${user.id}/${documentType}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error('[KYC] upload', uploadError);
    return { ok: false, error: uploadError.message };
  }

  const { error: dbError } = await supabase.from('kyc_documents').upsert(
    {
      client_id: user.id,
      document_type: documentType,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      uploaded_at: new Date().toISOString(),
    },
    { onConflict: 'client_id,document_type' }
  );

  if (dbError) {
    console.error('[KYC] upsert doc', dbError);
    return { ok: false, error: dbError.message };
  }

  if (['none', 'rejected'].includes((await getMyKycProfile())?.kyc_status ?? 'none')) {
    await supabase.from('profiles').update({ kyc_status: 'pending' }).eq('id', user.id);
  }

  return { ok: true };
}

export async function submitKycForReview(): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc('submit_kyc_for_review');

  if (error) {
    return { ok: false, error: error.message };
  }
  const result = data as { success?: boolean; error?: string };
  if (!result?.success) {
    return { ok: false, error: result?.error ?? 'Faltan documentos' };
  }
  return { ok: true };
}

export async function getKycSignedUrl(storagePath: string, expiresIn = 300): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, expiresIn);
  if (error) {
    console.error('[KYC] signed url', error);
    return null;
  }
  return data.signedUrl;
}

/** Perfiles CLIENT con KYC en revisión (liderazgo) */
export async function getKycPendingClients(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'CLIENT')
    .eq('kyc_status', 'submitted')
    .order('kyc_submitted_at', { ascending: true });

  if (error) {
    console.error('[KYC] pending clients', error);
    return [];
  }
  return (data ?? []) as Profile[];
}

export async function getClientKycDocuments(clientId: string): Promise<KycDocument[]> {
  const { data, error } = await supabase
    .from('kyc_documents')
    .select('*')
    .eq('client_id', clientId)
    .order('document_type');

  if (error) return [];
  return (data ?? []) as KycDocument[];
}

export async function approveKyc(clientId: string): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc('approve_kyc', { p_client_id: clientId });

  if (error) return { ok: false, error: error.message };
  const result = data as { success?: boolean; error?: string };
  return { ok: !!result?.success, error: result?.error };
}

export async function rejectKyc(clientId: string, reason: string): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc('reject_kyc', {
    p_client_id: clientId,
    p_reason: reason,
  });

  if (error) return { ok: false, error: error.message };
  const result = data as { success?: boolean; error?: string };
  return { ok: !!result?.success, error: result?.error };
}
