import { Loader2 } from 'lucide-react';
import type { Position as DbPosition } from '../../../core/supabase/database.types';
import { dbToStorePosition, calcFloatingPnl } from '../utils/position-mappers';
import { useTradingStore } from '../store/trading.store';

interface ClientPositionsTableProps {
  positions: DbPosition[];
  loading?: boolean;
  showClosePrice?: boolean;
  emptyMessage?: string;
}

export function ClientPositionsTable({
  positions,
  loading,
  showClosePrice = false,
  emptyMessage = 'No hay posiciones.',
}: ClientPositionsTableProps) {
  const currentPrice = useTradingStore((s) => s.currentPrice);
  const rows = positions.map(dbToStorePosition);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted">
        <Loader2 className="animate-spin mr-2" size={20} />
        Cargando posiciones…
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className="text-muted text-sm py-8 text-center">{emptyMessage}</p>;
  }

  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-muted bg-surface-inset uppercase border-b border-border">
        <tr>
          <th className="py-3 px-4">Instrumento</th>
          <th className="py-3 px-4">Tipo</th>
          <th className="py-3 px-4">Volumen</th>
          <th className="py-3 px-4">Apertura</th>
          <th className="py-3 px-4">{showClosePrice ? 'Cierre' : 'Estado'}</th>
          <th className="py-3 px-4">PnL</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((pos) => {
          const pnl = showClosePrice ? (pos.pnl ?? 0) : calcFloatingPnl(pos, currentPrice);
          const isProfit = pnl >= 0;
          return (
            <tr key={pos.id} className="border-b border-border hover:bg-surface-inset">
              <td className="py-4 px-4 font-bold text-foreground">{pos.symbol}</td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {pos.type}
                </span>
              </td>
              <td className="py-4 px-4 font-mono text-muted">{pos.volume}</td>
              <td className="py-4 px-4 font-mono text-muted">${pos.openPrice.toLocaleString()}</td>
              <td className="py-4 px-4 font-mono text-foreground">
                {showClosePrice
                  ? (pos.closePrice != null ? `$${pos.closePrice.toLocaleString()}` : '—')
                  : pos.status}
              </td>
              <td className={`py-4 px-4 font-mono font-bold ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isProfit ? '+' : ''}{pnl.toFixed(2)} USD
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
