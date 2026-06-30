import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { getClientBundle, type ClientBundle } from '../../../core/supabase/services/staff.service';
import { ClientDetailHeader } from '../components/head/client-detail/ClientDetailHeader';
import { ClientWalletPanel } from '../components/head/client-detail/ClientWalletPanel';
import { ClientSecurityPanel } from '../components/head/client-detail/ClientSecurityPanel';
import { ClientPositionsPanel } from '../components/head/client-detail/ClientPositionsPanel';
import { ClientTransactionsPanel } from '../components/head/client-detail/ClientTransactionsPanel';
import { ClientCallsPanel } from '../components/head/client-detail/ClientCallsPanel';

export function HeadClientDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<ClientBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBundle = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const data = await getClientBundle(userId);
    if (!data) {
      setError('No se pudo cargar el cliente');
      setBundle(null);
    } else {
      setBundle(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void loadBundle();
  }, [loadBundle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">
        <Loader2 className="animate-spin mr-2" size={22} />
        Cargando perfil 360°...
      </div>
    );
  }

  if (error || !bundle || !userId) {
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

  const { profile, wallet, lead, transactions, calls, positions_open_count, positions_closed_count } =
    bundle;

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

      <ClientDetailHeader profile={profile} wallet={wallet} />

      <div className="grid lg:grid-cols-2 gap-4">
        <ClientWalletPanel clientId={userId} wallet={wallet} onUpdated={() => void loadBundle()} />
        <ClientSecurityPanel clientId={userId} profile={profile} onUpdated={() => void loadBundle()} />
      </div>

      <ClientPositionsPanel
        clientId={userId}
        openCount={positions_open_count}
        closedCount={positions_closed_count}
      />

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
        <ClientTransactionsPanel transactions={transactions} />
        <ClientCallsPanel calls={calls} />
      </div>
    </div>
  );
}
