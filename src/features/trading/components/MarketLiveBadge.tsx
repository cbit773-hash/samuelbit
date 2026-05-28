import { useTradingStore } from '../store/trading.store';

const LABELS = {
  connecting: { text: 'Conectando…', class: 'bg-accent-lime/20 text-brand400' },
  live: { text: 'En vivo', class: 'bg-emerald-500/20 text-emerald-400' },
  reconnecting: { text: 'Reconectando…', class: 'bg-accent-lime/20 text-brand400' },
  offline: { text: 'Sin feed', class: 'bg-gray-500/20 text-muted' },
};

export function MarketLiveBadge() {
  const wsStatus = useTradingStore((s) => s.wsStatus);
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const lastTickAt = useTradingStore((s) => s.lastTickAt);
  const cfg = LABELS[wsStatus];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`px-2 py-1 rounded-full font-bold flex items-center gap-1.5 ${cfg.class}`}>
        <span
          className={`w-2 h-2 rounded-full ${wsStatus === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-current opacity-50'}`}
        />
        {cfg.text} · {activeSymbol}
      </span>
      {lastTickAt && wsStatus === 'live' && (
        <span className="text-muted font-mono">
          tick {new Date(lastTickAt).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
