import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import {
  getKycPendingClients,
  getClientKycDocuments,
  getKycSignedUrl,
  approveKyc,
  rejectKyc,
  KYC_REQUIRED_DOCS,
} from '../../../core/supabase/services/kyc.service';
import type { KycDocument, Profile } from '../../../core/supabase/database.types';

export function KycReviewPanel() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [docs, setDocs] = useState<KycDocument[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await getKycPendingClients();
    setClients(list);
    if (selected && !list.find((c) => c.id === selected.id)) {
      setSelected(null);
      setDocs([]);
      setPreviewUrl(null);
      setPreviewMime(null);
    }
    setLoading(false);
  }, [selected]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectClient = async (client: Profile) => {
    setSelected(client);
    setPreviewUrl(null);
    setPreviewMime(null);
    setMessage(null);
    const d = await getClientKycDocuments(client.id);
    setDocs(d);
  };

  const previewDoc = async (doc: KycDocument) => {
    const url = await getKycSignedUrl(doc.storage_path);
    setPreviewUrl(url);
    setPreviewMime(doc.mime_type);
  };

  const handleApprove = async () => {
    if (!selected) return;
    setActionLoading(true);
    setMessage(null);
    const result = await approveKyc(selected.id);
    setActionLoading(false);
    if (!result.ok) {
      setMessage(result.error ?? 'Error al aprobar');
      return;
    }
    setMessage('KYC aprobado correctamente.');
    await refresh();
  };

  const handleReject = async () => {
    if (!selected) return;
    setActionLoading(true);
    setMessage(null);
    const result = await rejectKyc(selected.id, rejectReason || 'Documentación no válida');
    setActionLoading(false);
    if (!result.ok) {
      setMessage(result.error ?? 'Error al rechazar');
      return;
    }
    setMessage('KYC rechazado. El cliente puede volver a subir documentos.');
    setRejectReason('');
    await refresh();
  };

  if (loading && clients.length === 0) {
    return (
      <div className="flex justify-center py-12 text-muted">
        <Loader2 className="animate-spin mr-2" size={22} />
        Cargando cola KYC…
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="text-brand" /> Revisión KYC / AML
          <span className="text-brand400 text-sm font-normal">({clients.length} pendientes)</span>
        </h3>
        <button type="button" onClick={refresh} className="text-cyan-400 text-sm font-bold flex items-center gap-1">
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {message && (
        <p className="text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl">{message}</p>
      )}

      {clients.length === 0 ? (
        <p className="text-muted text-center py-12">No hay clientes con KYC pendiente de revisión.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2 max-h-[480px] overflow-y-auto">
            {clients.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectClient(c)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selected?.id === c.id
                    ? 'border-brand/50 bg-accent-lime/10'
                    : 'border-border bg-surface-inset hover:bg-surface-inset'
                }`}
              >
                <p className="text-foreground font-bold">{c.full_name}</p>
                <p className="text-muted text-xs">{c.email}</p>
                <p className="text-brand400 text-xs mt-1">
                  Enviado: {c.kyc_submitted_at ? new Date(c.kyc_submitted_at).toLocaleString('es-CO') : '—'}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 bg-surface-alt border border-border rounded-2xl p-6">
            {!selected ? (
              <p className="text-muted text-center py-16">Selecciona un cliente para revisar documentos.</p>
            ) : (
              <>
                <p className="text-foreground font-bold text-lg mb-4">{selected.full_name}</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {KYC_REQUIRED_DOCS.map((req) => {
                    const doc = docs.find((d) => d.document_type === req.type);
                    return (
                      <div key={req.type} className="bg-surface-inset border border-border p-3 rounded-xl">
                        <p className="text-xs text-muted mb-1">{req.label}</p>
                        {doc ? (
                          <button
                            type="button"
                            onClick={() => previewDoc(doc)}
                            className="text-cyan-400 text-sm font-bold flex items-center gap-1 hover:text-cyan-300"
                          >
                            <Eye size={14} /> Ver documento
                          </button>
                        ) : (
                          <span className="text-rose-400 text-sm">Falta</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {previewUrl && (
                  <div className="mb-6 border border-border rounded-xl overflow-hidden bg-black">
                    {previewMime === 'application/pdf' ? (
                      <iframe src={previewUrl} title="KYC preview" className="w-full h-64" />
                    ) : (
                      <img src={previewUrl} alt="Documento KYC" className="max-h-64 mx-auto object-contain p-2" />
                    )}
                  </div>
                )}

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Motivo de rechazo (opcional si rechazas)"
                  className="w-full bg-surface-inset border border-border rounded-lg p-3 text-foreground text-sm mb-4 h-20 resize-none"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={actionLoading || docs.length < 4}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    Aprobar KYC
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Rechazar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
