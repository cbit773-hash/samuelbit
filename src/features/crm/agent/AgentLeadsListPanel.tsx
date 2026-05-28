import { useState } from 'react';
import { ListChecks, Search } from 'lucide-react';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName, LEAD_STATUSES } from '../shared/crm-utils';

export function AgentLeadsListPanel({
  crm,
  onSelectLead,
}: {
  crm: ReturnType<typeof useAgentCrm>;
  onSelectLead: (leadId: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = crm.leads.filter((l) => {
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      leadName(l).toLowerCase().includes(q) ||
      (l.phone ?? '').includes(q) ||
      (l.email ?? '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-cyan-500 mb-6 flex items-center gap-2">
        <ListChecks /> Mis Leads ({crm.leads.length})
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {['ALL', ...LEAD_STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              statusFilter === s ? 'bg-cyan-600 text-foreground' : 'bg-surface-inset text-muted'
            }`}
          >
            {s === 'ALL' ? 'Todos' : s}
          </button>
        ))}
      </div>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar nombre, teléfono, email…"
          className="w-full bg-surface-inset border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground outline-none"
        />
      </div>
      <div className="space-y-2 max-h-[420px] overflow-y-auto">
        {filtered.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onSelectLead(l.id)}
            className="w-full text-left bg-surface-inset border border-border hover:border-cyan-500/40 p-4 rounded-xl flex justify-between items-center gap-4"
          >
            <div>
              <p className="text-foreground font-bold">{leadName(l)}</p>
              <p className="text-muted text-sm font-mono">{l.phone}</p>
              {l.client_user_id && (
                <p className="text-emerald-500 text-xs mt-1">Cliente registrado · cobro rápido OK</p>
              )}
            </div>
            <span className="text-xs font-bold text-muted shrink-0">{l.status}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted text-sm text-center py-8">Sin leads con ese filtro.</p>
        )}
      </div>
    </div>
  );
}
