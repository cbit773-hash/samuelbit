import { useState } from 'react';
import { XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useTradingStore } from '../store/trading.store';
import { useClientPositions } from '../hooks/useClientPositions';
import { calcFloatingPnl, dbToStorePosition } from '../utils/position-mappers';

type Tab = 'open' | 'closed';

export function PositionsList() {
  const [tab, setTab] = useState<Tab>('open');
  const positions = useTradingStore((state) => state.positions);
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const balance = useTradingStore((state) => state.balance);
  const equity = useTradingStore((state) => state.equity);
  const { closedPositions, loading, saving, closePosition, refresh, error } = useClientPositions();

  const closedRows = closedPositions.map(dbToStorePosition);

  return (
    <div className="bg-surface-alt border border-border rounded-2xl flex flex-col w-full overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setTab('open')}
            className={`font-bold text-sm pb-1 ${tab === 'open' ? 'text-foreground border-b-2 border-primary' : 'text-muted hover:text-foreground'}`}
          >
            Abiertas ({positions.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('closed')}
            className={`font-bold text-sm pb-1 ${tab === 'closed' ? 'text-foreground border-b-2 border-primary' : 'text-muted hover:text-foreground'}`}
          >
            Historial ({closedRows.length})
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-muted">Balance: <span className="text-foreground">${balance.toFixed(2)}</span></span>
          <span className="text-muted">Equity: <span className="text-cyan-400">${equity.toFixed(2)}</span></span>
          <button type="button" onClick={() => refresh()} className="text-muted hover:text-foreground flex items-center gap-1">
            <RefreshCw size={12} /> Sync
          </button>
        </div>
      </div>

      {error && (
        <p className="px-6 py-2 text-brand400 text-xs border-b border-border">{error}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted bg-surface-inset uppercase border-b border-border">
            <tr>
              <th className="px-6 py-3">Símbolo</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Volumen</th>
              <th className="px-6 py-3">Precio Apertura</th>
              <th className="px-6 py-3">{tab === 'open' ? 'Precio Actual' : 'Cierre'}</th>
              <th className="px-6 py-3">Beneficio (PNL)</th>
              {tab === 'open' && <th className="px-6 py-3 text-right">Acción</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted">
                  <Loader2 className="inline animate-spin mr-2" size={18} />
                  Cargando posiciones…
                </td>
              </tr>
            ) : tab === 'open' ? (
              positions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted">
                    No tienes posiciones abiertas. Usa COMPRAR/VENDER para abrir una en Supabase.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => {
                  const pnl = calcFloatingPnl(pos, currentPrice);
                  const isProfit = pnl >= 0;
                  return (
                    <tr key={pos.id} className="border-b border-border hover:bg-surface-inset transition-colors font-mono">
                      <td className="px-6 py-4 font-bold text-foreground font-sans">{pos.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {pos.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{pos.volume}</td>
                      <td className="px-6 py-4">${pos.openPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">${currentPrice?.toFixed(2) ?? '---'}</td>
                      <td className={`px-6 py-4 font-bold ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isProfit ? '+' : ''}{pnl.toFixed(2)} USD
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={saving || !currentPrice}
                          onClick={() => currentPrice && closePosition(pos.id, currentPrice)}
                          className="text-muted hover:text-rose-500 disabled:opacity-40 transition-colors"
                          title="Cerrar posición"
                        >
                          <XCircle size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )
            ) : closedRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted">
                  Sin historial de posiciones cerradas.
                </td>
              </tr>
            ) : (
              closedRows.map((pos) => {
                const pnl = pos.pnl ?? 0;
                const isProfit = pnl >= 0;
                return (
                  <tr key={pos.id} className="border-b border-border hover:bg-surface-inset font-mono opacity-80">
                    <td className="px-6 py-4 font-bold text-foreground font-sans">{pos.symbol}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {pos.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{pos.volume}</td>
                    <td className="px-6 py-4">${pos.openPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">${pos.closePrice?.toFixed(2) ?? '---'}</td>
                    <td className={`px-6 py-4 font-bold ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isProfit ? '+' : ''}{pnl.toFixed(2)} USD
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
