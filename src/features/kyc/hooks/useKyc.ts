import { useCallback, useEffect, useState } from 'react';
import {
  getMyKycProfile,
  getMyKycDocuments,
  uploadKycDocument,
  submitKycForReview,
  KYC_REQUIRED_DOCS,
} from '../../../core/supabase/services/kyc.service';
import type { KycDocument, KycDocumentType, KycStatus } from '../../../core/supabase/database.types';
import { isDemoUserId } from '../../../core/supabase/demo-ids';
import { useAuthStore } from '../../auth/store/auth.store';

export function useKyc() {
  const user = useAuthStore((s) => s.user);
  const isDemo = isDemoUserId(user?.id);

  const [status, setStatus] = useState<KycStatus>('none');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<KycDocumentType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isDemo) {
      setLoading(false);
      setError('Inicia sesión con tu cuenta para subir documentos KYC.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [profile, docs] = await Promise.all([getMyKycProfile(), getMyKycDocuments()]);
      setStatus((profile?.kyc_status as KycStatus) ?? 'none');
      setRejectionReason(profile?.kyc_rejection_reason ?? null);
      setDocuments(docs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error KYC');
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File, type: KycDocumentType) => {
      setUploading(type);
      setError(null);
      const result = await uploadKycDocument(file, type);
      setUploading(null);
      if (!result.ok) {
        setError(result.error ?? 'Error al subir');
        return false;
      }
      await refresh();
      return true;
    },
    [refresh]
  );

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    const result = await submitKycForReview();
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? 'No se pudo enviar');
      return false;
    }
    await refresh();
    return true;
  }, [refresh]);

  const uploadedTypes = new Set(documents.map((d) => d.document_type));
  const allUploaded = KYC_REQUIRED_DOCS.every((r) => uploadedTypes.has(r.type));
  const canSubmit = allUploaded && ['none', 'pending', 'rejected'].includes(status);
  const isLocked = status === 'submitted' || status === 'verified';

  return {
    status,
    rejectionReason,
    documents,
    loading,
    uploading,
    submitting,
    error,
    isDemo,
    allUploaded,
    canSubmit,
    isLocked,
    refresh,
    upload,
    submit,
  };
}
