import { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useTradingStore, useActivePrice } from '../store/trading.store';
import { TRADING_INSTRUMENTS } from '../config/instruments';
import { marketSymbolToDb } from '../utils/symbol-map';
import { placePendingOrder } from '../../../core/supabase/services/orders.service';
import { boltTheme } from '../../../shared/theme/bolt-theme';

const LIVE = TRADING_INSTRUMENTS.filter((i) => i.availability === 'live' && i.marketSymbol);

interface PendingOrderFormProps {
  onPlaced: () => void;
  defaultOrderType?: 'LIMIT' | 'STOP';
  variant?: 'inline' | 'compact';
}

export function PendingOrderForm({
  onPlaced,
  defaultOrderType = 'LIMIT',
  variant = 'inline',
}: PendingOrderFormProps) {
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const orderVolume = useTradingStore((s) => s.orderVolume);
  const chartClickPrice = useTradingStore((s) => s.chartClickPrice);
  const setChartClickPrice = useTradingStore((s) => s.setChartClickPrice);
  const marketPrice = useActivePrice();

  const [symbol, setSymbol] = useState(activeSymbol);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'LIMIT' | 'STOP'>(defaultOrderType);
  const [volume, setVolume] = useState(orderVolume);
  const [triggerPrice, setTriggerPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    setOrderType(defaultOrderType);
  }, [defaultOrderType]);

  useEffect(() => {
    setSymbol(activeSymbol);
  }, [activeSymbol]);

  useEffect(() => {
    if (chartClickPrice != null && Number.isFinite(chartClickPrice)) {
      setTriggerPrice(String(chartClickPrice));
    }
  }, [chartClickPrice]);

  const useMarketTrigger = () => {
    if (marketPrice != null) setTriggerPrice(String(marketPrice));
  };

  const parseOpt = (s: string) => {
    const n = parseFloat(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const vol = parseFloat(volume);
    const trigger = parseFloat(triggerPrice);
    if (!vol || vol <= 0) {
      setMessage({ type: 'err', text: 'Cantidad inválida' });
      return;
    }
    if (!trigger || trigger <= 0) {
      setMessage({ type: 'err', text: 'Precio de activación requerido' });
      return;
    }

    setSaving(true);
    const result = await placePendingOrder({
      symbol: marketSymbolToDb(symbol),
      side,
      order_type: orderType,
      volume: vol,
      trigger_price: trigger,
      stop_loss: parseOpt(stopLoss),
      take_profit: parseOpt(takeProfit),
    });
    setSaving(false);

    if (result.error) {
      setMessage({ type: 'err', text: result.error });
      return;
    }
    setMessage({ type: 'ok', text: 'Orden pendiente registrada' });
    setTriggerPrice('');
    setStopLoss('');
    setTakeProfit('');
    setChartClickPrice(null);
    onPlaced();
  };

  const isCompact = variant === 'compact';

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isCompact
          ? 'space-y-3'
          : 'px-3 py-2 border-b flex flex-wrap items-end gap-2'
      }
      style={
        isCompact
          ? undefined
          : { borderColor: boltTheme.border, background: 'rgba(0,0,0,0.25)' }
      }
    >
      {isCompact && (
        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] text-muted uppercase font-bold">Lado</label>
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(['BUY', 'SELL'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`flex-1 py-2 text-xs font-bold ${
                  side === s
                    ? s === 'BUY'
                      ? 'bg-emerald-600 text-polar-white'
                      : 'bg-rose-600 text-polar-white'
                    : 'bg-surface-inset text-muted'
                }`}
              >
                {s === 'BUY' ? 'Compra' : 'Venta'}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isCompact && (
        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] text-muted uppercase font-bold">Instrumento</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-surface-inset border border-border rounded px-2 py-1 text-[11px] text-foreground min-w-[100px]"
          >
            {LIVE.map((i) => (
              <option key={i.marketSymbol} value={i.marketSymbol!}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {!isCompact && (
        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] text-muted uppercase font-bold">Lado</label>
          <div className="flex rounded overflow-hidden border border-border">
            {(['BUY', 'SELL'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`px-2 py-1 text-[10px] font-bold ${
                  side === s
                    ? s === 'BUY'
                      ? 'bg-emerald-600 text-foreground'
                      : 'bg-rose-600 text-foreground'
                    : 'bg-surface-inset text-muted'
                }`}
              >
                {s === 'BUY' ? 'Compra' : 'Venta'}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isCompact && (
        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] text-muted uppercase font-bold">Tipo</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as 'LIMIT' | 'STOP')}
            className="bg-surface-inset border border-border rounded px-2 py-1 text-[11px] text-foreground"
          >
            <option value="LIMIT">Límite</option>
            <option value="STOP">Stop</option>
          </select>
        </div>
      )}

      <div className={isCompact ? 'space-y-3' : 'contents'}>
        <div className={isCompact ? '' : 'flex flex-col gap-0.5'}>
          <label
            className={
              isCompact
                ? 'text-xs text-muted font-semibold uppercase'
                : 'text-[9px] text-muted uppercase font-bold'
            }
          >
            Cantidad (lotes)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className={
              isCompact
                ? 'mt-1.5 w-full bg-surface-inset border border-border rounded-lg px-3 py-2.5 text-foreground font-mono text-base outline-none focus:border-blue-500'
                : 'w-16 bg-surface-inset border border-border rounded px-2 py-1 text-[11px] text-foreground font-mono'
            }
          />
        </div>

        <div className={isCompact ? '' : 'flex flex-col gap-0.5'}>
          <label
            className={
              isCompact
                ? 'text-xs text-muted font-semibold uppercase'
                : 'text-[9px] text-muted uppercase font-bold'
            }
          >
            Precio de activación
          </label>
          <div className={`flex gap-1 ${isCompact ? 'mt-1.5' : ''}`}>
            <input
              type="number"
              step="any"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              placeholder={marketPrice?.toFixed(2) ?? '0'}
              className={
                isCompact
                  ? 'flex-1 bg-surface-inset border border-border rounded-lg px-3 py-2.5 text-foreground font-mono text-sm outline-none focus:border-blue-500'
                  : 'w-24 bg-surface-inset border border-border rounded px-2 py-1 text-[11px] text-foreground font-mono'
              }
            />
            <button
              type="button"
              onClick={useMarketTrigger}
              className={
                isCompact
                  ? 'shrink-0 px-3 py-2 rounded-lg border border-border text-xs text-brand hover:text-brand-hover'
                  : 'text-[9px] text-brand hover:text-brand-hover px-1 whitespace-nowrap'
              }
              title="Usar precio de mercado"
            >
              Mercado
            </button>
          </div>
        </div>

        <div className={isCompact ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-0.5'}>
          <div>
            <label className="text-[10px] text-muted uppercase">Stop Loss</label>
            <input
              type="number"
              step="any"
              placeholder="Opcional"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className={
                isCompact
                  ? 'mt-1 w-full bg-surface-inset border border-border rounded-lg px-2 py-2 text-foreground font-mono text-sm outline-none focus:border-blue-500'
                  : 'w-14 bg-surface-inset border border-border rounded px-1 py-1 text-[10px] text-foreground font-mono'
              }
            />
          </div>
          <div>
            <label className="text-[10px] text-muted uppercase">Take Profit</label>
            <input
              type="number"
              step="any"
              placeholder="Opcional"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className={
                isCompact
                  ? 'mt-1 w-full bg-surface-inset border border-border rounded-lg px-2 py-2 text-foreground font-mono text-sm outline-none focus:border-blue-500'
                  : 'w-14 bg-surface-inset border border-border rounded px-1 py-1 text-[10px] text-foreground font-mono'
              }
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className={
          isCompact
            ? 'w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-polar-white text-sm font-bold'
            : 'flex items-center gap-1 bg-primary hover:bg-primary disabled:opacity-50 text-foreground text-[10px] font-bold px-3 py-1.5 rounded'
        }
      >
        {saving ? <Loader2 size={isCompact ? 18 : 12} className="animate-spin" /> : <Plus size={isCompact ? 18 : 12} />}
        {isCompact ? `Colocar orden ${orderType === 'LIMIT' ? 'límite' : 'stop'}` : 'Nueva orden'}
      </button>

      {message && (
        <p
          className={`text-xs ${message.type === 'ok' ? 'text-emerald-400' : 'text-rose-400'} ${isCompact ? 'text-center' : 'text-[10px] w-full'}`}
        >
          {message.text}
        </p>
      )}

      {!isCompact && (
        <p className="text-[8px] text-muted w-full">
          LIMIT compra: ejecuta si el precio baja al nivel. STOP compra: si el precio sube. Se evalúa en tiempo real.
        </p>
      )}
    </form>
  );
}
