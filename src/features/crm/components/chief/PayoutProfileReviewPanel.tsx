import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import {
  listPendingPayoutProfiles,
  reviewPayoutProfile,
} from '../../../../core/supabase/services/client-payout-profile.service';
import type { PendingPayoutProfileRow } from '../../../../core/supabase/database.types';
import { KYC_STATUS_LABELS } from '../../../../core/supabase/services/kyc.service';

interface PayoutProfileReviewPanelProps {
  onReviewed?: () => void;
}

export function PayoutProfileReviewPanel({ onReviewed }: PayoutProfileReviewPanelProps) {
  const [rows, setRows] = useState<PendingPayoutProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setRows(await listPendingPayoutProfiles());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const approve = async (clientId: string) => {
    setActionId(clientId);
    setError(null);
    const { error: err } = await reviewPayoutProfile(clientId, 'approved');
    setActionId(null);
    if (err) {
      setError(err);
      return;
    }
    await load();
    onReviewed?.();
  };

  const reject = async (clientId: string) => {
    if (rejectReason.trim().length < 3) {
      setError('Indica un motivo de rechazo (mín. 3 caracteres).');
      return;
    }
    setActionId(clientId);
    setError(null);
    const { error: err } = await reviewPayoutProfile(clientId, 'rejected', rejectReason.trim());
    setActionId(null);
    setRejectId(null);
    setRejectReason('');
    if (err) {
      setError(err);
      return;
    }
    await load();
    onReviewed?.();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12 text-muted">
        <Loader2 className="animate-spin mr-2" size={28} />
        Cargando perfiles de retiro…
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-foreground">Datos de retiro (CCI) — pendientes</h3>
        <p className="text-muted text-sm mt-1">
          Verifica que el titular coincida con KYC. CCI de terceros: rechazar según política AML.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-muted text-center py-10 border border-dashed border-border rounded-xl">
          No hay perfiles de retiro pendientes.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted bg-surface-inset uppercase">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">KYC</th>
                <th className="py-3 px-4">Banco</th>
                <th className="py-3 px-4">CCI</th>
                <th className="py-3 px-4">Titular</th>
                <th className="py-3 px-4">Crypto</th>
                <th className="py-3 px-4">Enviado</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.client_id} className="border-t border-border hover:bg-surface-inset/50">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-foreground">{r.full_name}</p>
                    <p className="text-xs text-muted">{r.email}</p>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {r.kyc_status ? KYC_STATUS_LABELS[r.kyc_status] : '—'}
                  </td>
                  <td className="py-3 px-4">{r.bank_name}</td>
                  <td className="py-3 px-4 font-mono text-xs">{r.bank_cci}</td>
                  <td className="py-3 px-4">{r.account_holder}</td>
                  <td className="py-3 px-4 font-mono text-[10px] max-w-[120px] truncate">
                    {r.crypto_address ?? '—'}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted whitespace-nowrap">
                    {new Date(r.submitted_at).toLocaleString('es-PE')}
                  </td>
                  <td className="py-3 px-4">
                    {rejectId === r.client_id ? (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <input
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Motivo de rechazo"
                          className="bg-surface-inset border border-border rounded px-2 py-1 text-xs text-foreground"
                        />
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => void reject(r.client_id)}
                            disabled={actionId === r.client_id}
                            className="text-xs bg-rose-600 hover:bg-rose-500 text-white px-2 py-1 rounded"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectId(null);
                              setRejectReason('');
                            }}
                            className="text-xs border border-border px-2 py-1 rounded text-muted"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void approve(r.client_id)}
                          disabled={actionId === r.client_id}
                          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
                          title="Aprobar"
                        >
                          {actionId === r.client_id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectId(r.client_id)}
                          disabled={actionId === r.client_id}
                          className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 disabled:opacity-50"
                          title="Rechazar"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
