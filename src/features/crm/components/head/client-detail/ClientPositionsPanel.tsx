import { useEffect, useState } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';
import { listClientPositions, type ClientPositionRow } from '../../../../../core/supabase/services/staff.service';
import { dbSymbolToMarket } from '../../../../trading/utils/symbol-map';
import { formatUsd } from '../../../../wallet/utils/format-usd';

interface ClientPositionsPanelProps {
  clientId: string;
  openCount: number;
  closedCount: number;
}

type StatusFilter = 'OPEN' | 'CLOSED';
type ModeFilter = 'all' | 'demo' | 'live';

export function ClientPositionsPanel({ clientId, openCount, closedCount }: ClientPositionsPanelProps) {
  const [status, setStatus] = useState<StatusFilter>('OPEN');
  const [mode, setMode] = useState<ModeFilter>('all');
  const [rows, setRows] = useState<ClientPositionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void listClientPositions(clientId, {
      status,
      accountMode: mode === 'all' ? undefined : mode,
      limit: 50,
    }).then((data) => {
      if (!cancelled) {
        setRows(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [clientId, status, mode]);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <BarChart3 size={16} className="text-brand" />
          Operaciones
        </h3>
        <p className="text-xs text-muted">
          Abiertas: {openCount} · Cerradas: {closedCount}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['OPEN', 'CLOSED'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              status === s ? 'bg-brand text-brand-ink' : 'bg-surface-inset text-muted'
            }`}
          >
            {s === 'OPEN' ? 'Abiertas' : 'Cerradas'}
          </button>
        ))}
        {(['all', 'demo', 'live'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${
              mode === m ? 'bg-surface-inset text-foreground border border-brand/30' : 'text-muted'
            }`}
          >
            {m === 'all' ? 'Todos' : m}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8 text-muted">
          <Loader2 className="animate-spin" size={22} />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted py-4">Sin operaciones en este filtro.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-surface-inset">
              <tr>
                <th className="px-3 py-2">Par</th>
                <th className="px-3 py-2">Lado</th>
                <th className="px-3 py-2">Modo</th>
                <th className="px-3 py-2">Vol</th>
                <th className="px-3 py-2">Apertura</th>
                <th className="px-3 py-2">Cierre</th>
                <th className="px-3 py-2">PnL</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/50">
                  <td className="px-3 py-2 font-mono">{dbSymbolToMarket(r.symbol)}</td>
                  <td className={`px-3 py-2 font-bold ${r.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {r.type}
                  </td>
                  <td className="px-3 py-2 text-muted capitalize">{r.account_mode}</td>
                  <td className="px-3 py-2">{r.volume}</td>
                  <td className="px-3 py-2 font-mono">{r.open_price.toFixed(2)}</td>
                  <td className="px-3 py-2 font-mono">
                    {r.close_price != null ? r.close_price.toFixed(2) : '—'}
                  </td>
                  <td
                    className={`px-3 py-2 font-mono ${
                      r.pnl == null ? 'text-muted' : r.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {r.pnl != null ? formatUsd(r.pnl) : '—'}
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
