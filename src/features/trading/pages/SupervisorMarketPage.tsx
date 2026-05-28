import { useEffect, useState } from 'react';
import { getLeadershipOpenPositions } from '../../../core/supabase/services/orders.service';
import { useMultiMarketStream } from '../hooks/useMultiMarketStream';
import { useTradingStore } from '../store/trading.store';
import { dbSymbolToMarket } from '../utils/symbol-map';
import { calcFloatingPnl } from '../utils/position-mappers';
import type { StorePosition } from '../store/trading.store';
import { Loader2, Eye } from 'lucide-react';

export function SupervisorMarketPage() {
  useMultiMarketStream();
  const prices = useTradingStore((s) => s.prices);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getLeadershipOpenPositions>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeadershipOpenPositions().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const totalExposure = rows.reduce((sum, r) => {
    const sym = dbSymbolToMarket(r.symbol);
    const price = prices[sym] ?? r.open_price;
    return sum + r.volume * price;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
        <Eye className="text-brand" /> Mercado � Supervisor (solo lectura)
      </h1>
      <p className="text-muted text-sm mb-6">
        Exposici�n agregada de clientes. No puedes ejecutar �rdenes desde esta vista.
      </p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Posiciones abiertas</p>
          <p className="text-2xl font-black text-foreground">{rows.length}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Exposici�n nocional (aprox.)</p>
          <p className="text-2xl font-black text-cyan-400">
            ${totalExposure.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Feed</p>
          <p className="text-sm font-bold text-emerald-400">Binance live</p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-brand" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-surface-inset">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">S�mbolo</th>
                <th className="px-4 py-3">Lado</th>
                <th className="px-4 py-3">Vol</th>
                <th className="px-4 py-3">Apertura</th>
                <th className="px-4 py-3">P&L flotante</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    Sin posiciones abiertas en clientes
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const sym = dbSymbolToMarket(r.symbol);
                  const pos: StorePosition = {
                    id: r.id,
                    symbol: sym,
                    type: r.type as 'BUY' | 'SELL',
                    volume: r.volume,
                    openPrice: r.open_price,
                    status: 'OPEN',
                  };
                  const pnl = calcFloatingPnl(pos, prices[sym] ?? null);
                  return (
                    <tr key={r.id} className="border-t border-border hover:bg-surface">
                      <td className="px-4 py-3">
                        <p className="font-bold text-foreground">{r.client_name ?? '�'}</p>
                        <p className="text-[10px] text-muted">{r.client_email}</p>
                      </td>
                      <td className="px-4 py-3 font-mono">{r.symbol}</td>
                      <td className={r.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                        {r.type}
                      </td>
                      <td className="px-4 py-3">{r.volume}</td>
                      <td className="px-4 py-3 font-mono">{r.open_price.toFixed(2)}</td>
                      <td className={pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {pnl >= 0 ? '+' : ''}
                        {pnl.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
