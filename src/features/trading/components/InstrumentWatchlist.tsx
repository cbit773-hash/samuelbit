import { Link } from 'react-router-dom';
import { TRADING_INSTRUMENTS } from '../config/instruments';
import { useTradingStore } from '../store/trading.store';
import { boltTheme } from '../../../shared/theme/bolt-theme';

const EMPTY_PRICE_HISTORY: { time: number; value: number }[] = [];

function pctChange(history: { time: number; value: number }[]): number | null {
  if (history.length < 2) return null;
  const first = history[0].value;
  const last = history[history.length - 1].value;
  if (first === 0) return null;
  return ((last - first) / first) * 100;
}

function MiniSparkline({ history }: { history: { time: number; value: number }[] }) {
  if (history.length < 2) {
    return <div className="w-14 h-7 bg-surface rounded" />;
  }
  const values = history.map((h) => h.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 56;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  const up = values[values.length - 1] >= values[0];
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        fill="none"
        stroke={up ? boltTheme.buyGreen : boltTheme.sellRed}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

function ComingSoonRow({ label }: { label: string }) {
  return (
    <div className="w-full min-w-[140px] text-left px-3 py-2.5 rounded-lg opacity-50 max-md:shrink-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted truncate">{label}</span>
        <span className="text-[9px] font-bold text-muted uppercase shrink-0">Pr�ximamente</span>
      </div>
    </div>
  );
}

function WatchlistRow({
  sym,
  label,
  active,
  onSelect,
}: {
  sym: string;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  const price = useTradingStore((s) => s.prices[sym]);
  const historySlice = useTradingStore((s) => s.priceHistory[sym]);
  const history = historySlice ?? EMPTY_PRICE_HISTORY;
  const pct = pctChange(history);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors border-l-2 ${
        active
          ? 'bg-primary/20 border-l-blue-500 border border-blue-500/30'
          : 'border-l-transparent hover:bg-surface border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-bold text-foreground truncate">{label}</span>
        {pct != null && (
          <span
            className={`text-[10px] font-mono font-bold shrink-0 ${
              pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {pct >= 0 ? '+' : ''}
            {pct.toFixed(2)}%
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-1.5 gap-2">
        <MiniSparkline history={history} />
        <span className="text-xs font-mono text-emerald-400 font-semibold">
          {price != null ? price.toFixed(price > 100 ? 2 : 4) : '�'}
        </span>
      </div>
    </button>
  );
}

export function InstrumentWatchlist() {
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const setActiveSymbol = useTradingStore((s) => s.setActiveSymbol);

  const live = TRADING_INSTRUMENTS.filter((i) => i.availability === 'live' && i.marketSymbol);
  const soon = TRADING_INSTRUMENTS.filter((i) => i.availability === 'coming_soon');

  return (
    <aside
      className="w-[200px] xl:w-[220px] shrink-0 flex flex-col border-r overflow-y-auto max-md:max-h-28 max-md:w-full max-md:border-r-0 max-md:border-b"
      style={{ background: boltTheme.bgPanel, borderColor: boltTheme.border }}
    >
      <div
        className="px-3 py-2 border-b shrink-0 max-md:hidden"
        style={{ borderColor: boltTheme.border }}
      >
        <p className="text-xs font-bold text-muted uppercase tracking-wider">Mercados</p>
      </div>
      <div className="flex-1 p-1.5 space-y-0.5 max-md:flex max-md:flex-row max-md:overflow-x-auto max-md:gap-1 max-md:p-2 max-md:flex-none">
        {live.map((inst) => {
          const sym = inst.marketSymbol!;
          return (
            <WatchlistRow
              key={sym}
              sym={sym}
              label={inst.label}
              active={activeSymbol === sym}
              onSelect={() => setActiveSymbol(sym)}
            />
          );
        })}
        {soon.map((inst) => (
          <ComingSoonRow key={inst.id} label={inst.label} />
        ))}
      </div>
      <p className="p-2 text-[10px] text-muted leading-snug max-md:hidden">
        CFD v�a Binance.{' '}
        <Link to="/legal/riesgos" className="text-brand/80 hover:underline">
          Riesgos
        </Link>
      </p>
    </aside>
  );
}
