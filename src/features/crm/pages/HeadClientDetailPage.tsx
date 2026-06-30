import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Phone, Mail, Wallet, FileText } from 'lucide-react';
import { getClientBundle } from '../../../core/supabase/services/staff.service';
import type { ClientBundle } from '../../../core/supabase/services/staff.service';
import { formatUsd } from '../../wallet/utils/format-usd';
import type { Transaction } from '../../../core/supabase/services/wallet.service';

export function HeadClientDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<ClientBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    void getClientBundle(userId).then((data: ClientBundle | null) => {
      if (cancelled) return;
      if (!data) setError('No se pudo cargar el cliente');
      setBundle(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">
        <Loader2 className="animate-spin mr-2" size={22} />
        Cargando perfil 360°...
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="text-center py-24">
        <p className="text-rose-400 mb-4">{error ?? 'Cliente no encontrado'}</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/head?tab=clientes')}
          className="text-primary font-semibold"
        >
          Volver a clientes
        </button>
      </div>
    );
  }

  const { profile, wallet, lead, transactions, calls } = bundle;

  return (
    <div className="space-y-6 max-w-5xl">
      <button
        type="button"
        onClick={() => navigate('/dashboard/head?tab=clientes')}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Volver a clientes
      </button>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-2xl font-black text-foreground">{profile.full_name}</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Mail size={14} />
            {profile.email}
          </span>
          {profile.phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone size={14} />
              {profile.phone}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Wallet size={14} />
            Live: {formatUsd(Number(wallet?.balance ?? 0))} · Demo:{' '}
            {formatUsd(Number(wallet?.demo_balance ?? 0))}
          </span>
        </div>
      </div>

      {lead && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <FileText size={16} />
            Lead vinculado
          </h3>
          <p className="text-sm text-muted">
            {lead.first_name} {lead.last_name} · Estado:{' '}
            <span className="text-foreground font-semibold">{lead.status}</span>
          </p>
          {lead.notes && <p className="text-sm text-muted mt-2">{lead.notes}</p>}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-bold mb-3">Transacciones recientes</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transactions.length === 0 && (
              <p className="text-sm text-muted">Sin transacciones.</p>
            )}
            {transactions.map((tx: Transaction) => (
              <div
                key={tx.id}
                className="flex justify-between text-sm border-b border-border/50 pb-2"
              >
                <span className="capitalize">
                  {tx.type} · {tx.status}
                </span>
                <span className="font-mono">{formatUsd(Number(tx.amount))}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-bold mb-3">Llamadas CRM</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {calls.length === 0 && <p className="text-sm text-muted">Sin llamadas registradas.</p>}
            {calls.map((c: ClientBundle['calls'][number]) => (
              <div key={c.id} className="text-sm border-b border-border/50 pb-2">
                <span className="text-foreground">{c.direction}</span>
                <span className="text-muted"> · {c.status}</span>
                {c.duration_seconds != null && (
                  <span className="text-muted"> · {c.duration_seconds}s</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
