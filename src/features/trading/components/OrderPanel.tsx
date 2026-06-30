import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowUpCircle } from 'lucide-react';
import { useTradingStore, useActivePrice } from '../store/trading.store';
import { useTradingPositions } from '../context/TradingPositionsContext';
import { requiredMargin, calcFreeMargin } from '../utils/margin.calculator';
import { getOrderBlockReason } from '../utils/order-guards';
import { getInstrumentByMarketSymbol } from '../config/instruments';
import { boltTheme } from '../../../shared/theme/bolt-theme';
import { CLIENT_PATHS } from '../../../shared/routing/paths';
import { PendingOrderForm } from './PendingOrderForm';

const VOLUME_PRESETS = ['0.01', '0.1', '0.5', '1'];
type OrderTab = 'market' | 'limit' | 'stop';

export function OrderPanel({
  className = '',
  variant = 'sidebar',
}: {
  className?: string;
  variant?: 'sidebar' | 'sheet';
}) {
  const [orderTab, setOrderTab] = useState<OrderTab>('market');
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const chartClickPrice = useTradingStore((s) => s.chartClickPrice);
  const setChartClickPrice = useTradingStore((s) => s.setChartClickPrice);
  const orderVolume = useTradingStore((s) => s.orderVolume);
  const orderStopLoss = useTradingStore((s) => s.orderStopLoss);
  const orderTakeProfit = useTradingStore((s) => s.orderTakeProfit);
  const setOrderVolume = useTradingStore((s) => s.setOrderVolume);
  const setOrderStopLoss = useTradingStore((s) => s.setOrderStopLoss);
  const setOrderTakeProfit = useTradingStore((s) => s.setOrderTakeProfit);
  const equity = useTradingStore((s) => s.equity);
  const balance = useTradingStore((s) => s.balance);
  const usedMargin = useTradingStore((s) => s.usedMargin);
  const marginLevel = useTradingStore((s) => s.marginLevel);
  const leverage = useTradingStore((s) => s.leverage);
  const accountMode = useTradingStore((s) => s.accountMode);
  const wsStatus = useTradingStore((s) => s.wsStatus);
  const price = useActivePrice();
  const { openPosition, saving, loading, refresh, closeAllOpenPositions } = useTradingPositions();
  const positions = useTradingStore((s) => s.positions);

  const inst = getInstrumentByMarketSymbol(activeSymbol);
  const vol = parseFloat(orderVolume) || 0;
  const blockReason = getOrderBlockReason({
    wsStatus,
    accountMode,
    activeBalance: balance,
    equity,
    usedMargin,
    marginLevel,
    volume: vol,
    price,
    leverage,
  });
  const canTrade = blockReason === null;
  const openOnSymbol = positions.filter(
    (p) => p.status === 'OPEN' && p.symbol === activeSymbol,
  );
  const [closingAll, setClosingAll] = useState(false);

  const parseOptional = (s: string) => {
    const n = parseFloat(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const execute = async (type: 'BUY' | 'SELL') => {
    if (!price || !canTrade) return;
    if (openOnSymbol.length >= 3) {
      const label = displaySymbol;
      const ok = window.confirm(
        `Ya tienes ${openOnSymbol.length} posiciones abiertas en ${label}. ¿Abrir otra operación ${type === 'BUY' ? 'de compra' : 'de venta'}?`,
      );
      if (!ok) return;
    }
    try {
      await openPosition({
        type,
        volume: vol,
        openPrice: price,
        symbol: activeSymbol,
        stop_loss: parseOptional(orderStopLoss),
        take_profit: parseOptional(orderTakeProfit),
      });
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo abrir la posición');
    }
  };

  const bid = price != null ? (price * 0.9999).toFixed(price > 100 ? 2 : 4) : '—';
  const ask = price != null ? (price * 1.0001).toFixed(price > 100 ? 2 : 4) : '—';
  const displaySymbol = activeSymbol.replace('USDT', '/USDT');
  const marginReq = price != null && vol > 0 ? requiredMargin(vol, price, leverage) : 0;
  const freeAfter =
    price != null && vol > 0
      ? calcFreeMargin(equity, usedMargin) - marginReq
      : calcFreeMargin(equity, usedMargin);

  const tabBtn = (id: OrderTab, label: string) => (
    <button
      type="button"
      onClick={() => setOrderTab(id)}
      className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
        orderTab === id ? 'bg-primary text-polar-white' : 'text-muted hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside
      className={`shrink-0 flex flex-col ${
        variant === 'sidebar'
          ? 'border-l w-[280px] xl:w-[300px] max-lg:hidden'
          : 'w-full border-0'
      } ${className}`}
      style={{
        background: boltTheme.surfaceElevated,
        borderColor: boltTheme.border,
      }}
      aria-label="Panel de orden"
    >
      <div
        className="p-3 border-b shrink-0 sticky top-0 z-10"
        style={{ borderColor: boltTheme.border, background: boltTheme.surfaceElevated }}
      >
        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Operar</p>
        <p className="text-sm font-semibold text-muted mt-0.5">{displaySymbol}</p>
        <p className="text-3xl font-mono font-black text-emerald-400 mt-1 tabular-nums">
          {price != null ? price.toFixed(price > 100 ? 2 : 4) : '—'}
        </p>
        <p className="text-[10px] text-muted mt-0.5">Precio de mercado (ejecución)</p>
        {inst?.spreadHint && (
          <p className="text-[10px] text-muted mt-1">Spread ref. {inst.spreadHint}</p>
        )}
        <div className="grid grid-cols-2 gap-2 mt-3 text-center">
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-2 py-1.5">
            <p className="text-[9px] text-rose-300/80 uppercase font-bold">Venta</p>
            <p className="text-sm font-mono font-bold text-rose-400">{bid}</p>
          </div>
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-2 py-1.5">
            <p className="text-[9px] text-emerald-300/80 uppercase font-bold">Compra</p>
            <p className="text-sm font-mono font-bold text-emerald-400">{ask}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {accountMode === 'live' && balance <= 0 && (
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-3 space-y-2">
            <p className="text-xs text-primary/90 font-semibold leading-snug">
              Deposita fondos para operar en cuenta real.
            </p>
            <Link
              to={CLIENT_PATHS.accountTab('depositar')}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-pill bg-primary text-polar-white text-xs font-bold hover:bg-primary-hover"
            >
              <ArrowUpCircle size={16} />
              Depositar fondos
            </Link>
          </div>
        )}

        <div className="flex gap-1 p-0.5 rounded-lg bg-surface-inset/50 border border-border">
          {tabBtn('market', 'Mercado')}
          {tabBtn('limit', 'Límite')}
          {tabBtn('stop', 'Stop')}
        </div>

        {orderTab === 'market' && (
          <>
            <div>
              <label className="text-xs text-muted font-semibold uppercase">Cantidad (lotes)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={orderVolume}
                onChange={(e) => setOrderVolume(e.target.value)}
                className="mt-1.5 w-full bg-surface-inset border border-border rounded-lg px-3 py-2.5 text-foreground font-mono text-base outline-none focus:border-blue-500"
              />
              <div className="flex gap-1.5 mt-2">
                {VOLUME_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setOrderVolume(p)}
                    className={`flex-1 py-1 rounded text-[11px] font-bold ${
                      orderVolume === p
                        ? 'bg-primary text-polar-white'
                        : 'bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted uppercase">Stop Loss</label>
                <input
                  type="number"
                  placeholder="Opcional"
                  value={orderStopLoss}
                  onChange={(e) => setOrderStopLoss(e.target.value)}
                  className="mt-1 w-full bg-surface-inset border border-border rounded-lg px-2 py-2 text-foreground font-mono text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted uppercase">Take Profit</label>
                <input
                  type="number"
                  placeholder="Opcional"
                  value={orderTakeProfit}
                  onChange={(e) => setOrderTakeProfit(e.target.value)}
                  className="mt-1 w-full bg-surface-inset border border-border rounded-lg px-2 py-2 text-foreground font-mono text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {vol > 0 && price != null && (
              <div className="rounded-lg border border-border bg-surface-inset/30 p-2.5 text-[10px] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-muted">Margen requerido</span>
                  <span className="text-foreground">${marginReq.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Libre después</span>
                  <span className={freeAfter >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    ${freeAfter.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Apalancamiento</span>
                  <span className="text-foreground">{leverage}x</span>
                </div>
              </div>
            )}

            {blockReason && (
              <div
                className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-2.5 text-xs text-amber-100 leading-snug"
                role="status"
              >
                {blockReason}
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                disabled={saving || loading || closingAll || !canTrade}
                onClick={() => void execute('BUY')}
                aria-label={blockReason ? `Comprar: ${blockReason}` : 'Comprar'}
                title={blockReason ?? undefined}
                className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-polar-white font-black text-sm transition-colors"
              >
                {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : `COMPRAR ${ask}`}
              </button>
              <button
                type="button"
                disabled={saving || loading || closingAll || !canTrade}
                onClick={() => void execute('SELL')}
                aria-label={blockReason ? `Vender: ${blockReason}` : 'Vender'}
                title={blockReason ?? undefined}
                className="w-full py-3.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-polar-white font-black text-sm transition-colors"
              >
                {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : `VENDER ${bid}`}
              </button>
            </div>

            {accountMode === 'demo' && openOnSymbol.length > 0 && (
              <button
                type="button"
                disabled={saving || closingAll || loading}
                onClick={async () => {
                  if (
                    !window.confirm(
                      `¿Cerrar las ${openOnSymbol.length} posiciones abiertas en ${displaySymbol}?`,
                    )
                  ) {
                    return;
                  }
                  setClosingAll(true);
                  try {
                    await closeAllOpenPositions(activeSymbol);
                    await refresh();
                  } finally {
                    setClosingAll(false);
                  }
                }}
                className="w-full py-2 rounded-lg border border-border text-muted hover:text-foreground text-xs font-semibold disabled:opacity-50"
              >
                {closingAll ? 'Cerrando…' : `Cerrar todas en ${displaySymbol} (demo)`}
              </button>
            )}
          </>
        )}

        {(orderTab === 'limit' || orderTab === 'stop') && (
          <>
            {chartClickPrice != null && (
              <div className="flex items-center justify-between gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs">
                <span className="text-indigo-200 font-mono">
                  Precio desde gráfico: <strong>{chartClickPrice}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setChartClickPrice(null)}
                  className="text-muted hover:text-foreground font-bold shrink-0"
                >
                  Quitar
                </button>
              </div>
            )}
            <PendingOrderForm
              variant="compact"
              defaultOrderType={orderTab === 'limit' ? 'LIMIT' : 'STOP'}
              onPlaced={() => {
                setChartClickPrice(null);
                void refresh();
              }}
            />
          </>
        )}

        <p className="text-[10px] text-muted text-center leading-relaxed">
          Los CFD conllevan riesgo de pérdida del capital.
        </p>
      </div>
    </aside>
  );
}
