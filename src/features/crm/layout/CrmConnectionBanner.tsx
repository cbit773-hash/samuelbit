import { Database, Loader2, RefreshCw } from 'lucide-react';
import type { useAgentCrm } from '../hooks/useAgentCrm';

type CrmState = Pick<
  ReturnType<typeof useAgentCrm>,
  'loading' | 'error' | 'isDemo' | 'refresh' | 'stats' | 'dialerQueue' | 'depositKpis'
>;

export function CrmConnectionBanner({ crm }: { crm: CrmState }) {
  if (crm.loading) {
    return (
      <div className="flex items-center gap-2 text-cyan-400 text-sm mb-4">
        <Loader2 size={16} className="animate-spin" /> Cargando tus leads desde Supabase…
      </div>
    );
  }

  if (crm.error || crm.isDemo) {
    return (
      <div className="bg-accent-lime/10 border border-brand/40 rounded-xl p-4 mb-4 flex items-start gap-3">
        <Database className="text-brand400 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-brand200 font-bold text-sm">Conexión Supabase requerida</p>
          <p className="text-brand200/80 text-xs mt-1">
            {crm.error ?? 'Inicia sesión con tu cuenta de agente en Supabase Auth.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => crm.refresh()}
          className="ml-auto text-xs bg-accent-lime/600 hover:bg-primary-hover text-foreground px-3 py-1 rounded-lg font-bold flex items-center gap-1"
        >
          <RefreshCw size={12} /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted mb-4">
      <span><strong className="text-foreground">{crm.stats.total}</strong> leads asignados</span>
      <span><strong className="text-cyan-400">{crm.dialerQueue.length}</strong> en cola dialer</span>
      <span><strong className="text-brand">{crm.stats.callbacks}</strong> callbacks</span>
      <span><strong className="text-emerald-400">{crm.depositKpis.ftdCount}</strong> FTD aprobados</span>
    </div>
  );
}
