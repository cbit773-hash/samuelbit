import { Upload, Loader2, Shield, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useKyc } from '../hooks/useKyc';
import {
  KYC_REQUIRED_DOCS,
  KYC_STATUS_COLORS,
  KYC_STATUS_LABELS,
} from '../../../core/supabase/services/kyc.service';
import type { KycDocumentType } from '../../../core/supabase/database.types';

export function KycUploadPanel() {
  const kyc = useKyc();

  const handleFile = (type: KycDocumentType, file: File | undefined) => {
    if (file) kyc.upload(file, type);
  };

  if (kyc.loading) {
    return (
      <div className="flex justify-center py-12 text-muted">
        <Loader2 className="animate-spin mr-2" size={22} />
        Cargando KYC…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="text-cyan-500" /> Verificación KYC
          </h3>
          <p className={`text-sm font-bold mt-1 ${KYC_STATUS_COLORS[kyc.status]}`}>
            Estado: {KYC_STATUS_LABELS[kyc.status]}
          </p>
        </div>
        {kyc.status === 'verified' && (
          <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <CheckCircle size={18} /> Cuenta verificada
          </span>
        )}
      </div>

      {kyc.error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl flex gap-2">
          <AlertCircle size={18} className="shrink-0" />
          {kyc.error}
        </div>
      )}

      {kyc.status === 'rejected' && kyc.rejectionReason && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-4 rounded-xl">
          <strong>Motivo del rechazo:</strong> {kyc.rejectionReason}
          <p className="text-xs mt-2 text-rose-400/80">Sube documentos corregidos y envía de nuevo.</p>
        </div>
      )}

      {kyc.status === 'submitted' && (
        <div className="bg-primary/10 border border-blue-500/30 text-blue-300 text-sm p-4 rounded-xl">
          Documentación en revisión. Te notificaremos por email y en la app cuando se complete.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KYC_REQUIRED_DOCS.map((doc) => {
          const uploaded = kyc.documents.find((d) => d.document_type === doc.type);
          const isUploading = kyc.uploading === doc.type;

          return (
            <div
              key={doc.type}
              className={`border rounded-xl p-4 ${
                uploaded ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-surface-inset'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-foreground font-bold text-sm">{doc.label}</p>
                  <p className="text-muted text-xs mt-0.5">{doc.hint}</p>
                </div>
                {uploaded && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
              </div>
              {uploaded && (
                <p className="text-xs text-muted mb-2 truncate">{uploaded.file_name}</p>
              )}
              <label
                className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
                  kyc.isLocked
                    ? 'bg-gray-700 text-muted cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-foreground'
                }`}
              >
                {isUploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploaded ? 'Reemplazar' : 'Subir archivo'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  disabled={kyc.isLocked || isUploading}
                  onChange={(e) => handleFile(doc.type, e.target.files?.[0])}
                />
              </label>
            </div>
          );
        })}
      </div>

      {kyc.canSubmit && (
        <button
          type="button"
          onClick={() => kyc.submit()}
          disabled={kyc.submitting || !kyc.allUploaded}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-foreground font-black px-8 py-3 rounded-xl"
        >
          {kyc.submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          Enviar a revisión (CHIEF)
        </button>
      )}
    </div>
  );
}
