import { useTradingStore, type ChartInterval } from '../store/trading.store';
import { MarketLiveBadge } from './MarketLiveBadge';
import { AccountModeSwitcher } from './AccountModeSwitcher';
import { boltTheme } from '../../../shared/theme/bolt-theme';

const TIMEFRAMES: ChartInterval[] = ['15m', '1h', '1d'];

interface ChartToolbarProps {
  showDemoChip?: boolean;
}

export function ChartToolbar({ showDemoChip = false }: ChartToolbarProps) {
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const chartInterval = useTradingStore((s) => s.chartInterval);
  const setChartInterval = useTradingStore((s) => s.setChartInterval);
  const positions = useTradingStore((s) => s.positions);
  const showChartEntries = useTradingStore((s) => s.showChartEntries);
  const setShowChartEntries = useTradingStore((s) => s.setShowChartEntries);

  const displaySymbol = activeSymbol.replace('USDT', '/USDT');
  const openOnSymbol = positions.filter(
    (p) => p.status === 'OPEN' && p.symbol === activeSymbol,
  ).length;

  return (
    <div
      className="flex items-center justify-between px-3 py-2 border-b shrink-0 gap-2 flex-wrap"
      style={{ borderColor: boltTheme.border, background: boltTheme.bgPanel }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-wrap">
        <span className="text-base font-bold text-foreground truncate">{displaySymbol}</span>
        <MarketLiveBadge />
        {openOnSymbol > 0 && (
          <span className="text-[10px] font-mono font-semibold text-muted bg-surface-inset px-2 py-0.5 rounded-md border border-border">
            {openOnSymbol} abierta{openOnSymbol !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={() => setShowChartEntries(!showChartEntries)}
          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors border ${
            showChartEntries
              ? 'bg-primary/20 border-primary/40 text-brand'
              : 'bg-surface border-border text-muted hover:text-foreground'
          }`}
          aria-pressed={showChartEntries}
          title="Mostrar líneas de entrada en el gráfico"
        >
          Entradas
        </button>
        <AccountModeSwitcher compact />
        {showDemoChip && (
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide hidden xl:inline">
            Demo
          </span>
        )}
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setChartInterval(tf)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                chartInterval === tf
                  ? 'bg-primary text-polar-white'
                  : 'bg-surface text-muted hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
