import { Target } from 'lucide-react';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { formatCrmMoney } from '../shared/crm-utils';
import { projectedCommission } from '../../../shared/constants/agent-commission';

export function AgentFtdPanel({ crm }: { crm: ReturnType<typeof useAgentCrm> }) {
  const commission = projectedCommission(crm.depositKpis.ftdVolume);

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
        <Target /> Panel de Cierres (Supabase)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-inset border border-border p-6 rounded-xl text-center">
          <p className="text-muted text-sm font-bold mb-2">FTDs Aprobados</p>
          <p className="text-5xl font-black text-foreground">{crm.depositKpis.ftdCount}</p>
          <p className="text-emerald-500 text-xs font-bold mt-2">Leads FTD: {crm.stats.ftd}</p>
        </div>
        <div className="bg-surface-inset border border-border p-6 rounded-xl text-center">
          <p className="text-muted text-sm font-bold mb-2">Volumen FTD</p>
          <p className="text-4xl font-black text-foreground">{formatCrmMoney(crm.depositKpis.ftdVolume)}</p>
        </div>
        <div className="bg-surface-inset border border-border p-6 rounded-xl text-center">
          <p className="text-muted text-sm font-bold mb-2">Volumen Retención</p>
          <p className="text-4xl font-black text-foreground">{formatCrmMoney(crm.depositKpis.retentionVolume)}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center">
          <p className="text-emerald-400 text-sm font-bold mb-2">Comisión proyectada (8%)</p>
          <p className="text-4xl font-black text-emerald-500">{formatCrmMoney(commission)}</p>
          <p className="text-muted text-xs mt-2">Pendientes: {crm.depositKpis.pendingCount}</p>
        </div>
      </div>
      {crm.deposits.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted text-xs font-bold uppercase mb-2">Últimos depósitos</p>
          {crm.deposits.slice(0, 8).map((d) => (
            <div key={d.id} className="bg-surface-inset border border-border p-3 rounded-lg flex justify-between text-sm">
              <span className="text-foreground font-bold">{d.type} · {formatCrmMoney(Number(d.amount))}</span>
              <span className={d.status === 'Aprobado' ? 'text-emerald-400' : 'text-brand400'}>{d.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
