import { useState } from 'react';
import { Info } from 'lucide-react';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { useTradingStore } from '../../features/trading/store/trading.store';
import { boltTheme } from '../theme/bolt-theme';
import { Link } from 'react-router-dom';
import { AccountModeSwitcher } from '../../features/trading/components/AccountModeSwitcher';

const METRIC_HINTS: Record<string, string> = {
  pnl: 'Ganancias o p├®rdidas de tus posiciones abiertas en este momento.',
  equity: 'Capital total = balance + P&L abierto.',
  used: 'Margen reservado por tus posiciones abiertas.',
  free: 'Margen que puedes usar para abrir nuevas operaciones.',
};

function MetricCell({
  label,
  value,
  valueClass = 'text-foreground',
  hintKey,
  compact,
}: {
  label: string;
  value: string;
  valueClass?: string;
  hintKey?: keyof typeof METRIC_HINTS;
  compact?: boolean;
}) {
  const [showHint, setShowHint] = useState(false);
  const hint = hintKey ? METRIC_HINTS[hintKey] : undefined;

  return (
    <div
      className={`relative border-r last:border-r-0 ${compact ? 'px-3 py-1.5' : 'px-4 py-2'}`}
      style={{ borderColor: boltTheme.border }}
    >
      <p
        className={`text-muted flex items-center gap-1 ${compact ? 'text-[10px]' : 'text-[10px]'}`}
      >
        <span className="truncate">{label}</span>
        {hint && (
          <button
            type="button"
            className="shrink-0 opacity-50 hover:opacity-100"
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
            onFocus={() => setShowHint(true)}
            onBlur={() => setShowHint(false)}
            aria-label={`Info: ${label}`}
          >
            <Info size={10} />
          </button>
        )}
      </p>
      <p className={`font-mono font-bold ${compact ? 'text-xs' : 'text-sm'} ${valueClass}`}>
        {value}
      </p>
      {showHint && hint && (
        <div className="absolute left-0 top-full z-30 mt-1 max-w-[220px] rounded-lg bg-surface border border-border shadow-md px-2 py-1.5 text-[10px] text-muted">
          {hint}
        </div>
      )}
    </div>
  );
}

/** Evita -$0.00 por redondeo de PnL flotante casi cero */
function fmtUsd(n: number | undefined, opts?: { signed?: boolean }): string {
  let v = n ?? 0;
  if (!opts?.signed && Math.abs(v) < 0.005) v = 0;
  return v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

function ClientMetrics({ compact }: { compact?: boolean }) {
  const balance = useTradingStore((s) => s.balance);
  const equity = useTradingStore((s) => s.equity);
  const usedMargin = useTradingStore((s) => s.usedMargin);
  const freeMargin = useTradingStore((s) => s.freeMargin);
  const floatingPnl = useTradingStore((s) => s.floatingPnl);
  const accountMode = useTradingStore((s) => s.accountMode);
  const bookLabel = accountMode === 'demo' ? 'Demo' : 'Real';

  return (
    <>
      <MetricCell
        label="PnL abierto"
        value={fmtUsd(floatingPnl, { signed: true })}
        valueClass={(floatingPnl ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        hintKey="pnl"
        compact={compact}
      />
      <MetricCell label="Capital" value={fmtUsd(equity)} hintKey="equity" compact={compact} />
      <MetricCell
        label="Margen usado"
        value={fmtUsd(usedMargin)}
        hintKey="used"
        compact={compact}
      />
      <MetricCell
        label="Margen libre"
        value={fmtUsd(freeMargin)}
        valueClass="text-emerald-400"
        hintKey="free"
        compact={compact}
      />
      <div
        className={`flex items-center gap-2 ml-auto shrink-0 ${compact ? 'px-3 py-1' : 'px-4 py-2'}`}
      >
        <AccountModeSwitcher compact={compact} />
        {!compact && (
          <span className="text-[10px] text-muted font-mono hidden xl:inline">
            {bookLabel} {fmtUsd(balance)}
          </span>
        )}
      </div>
    </>
  );
}

function StaffMetrics() {
  const role = useAuthStore((s) => s.role);
  return (
    <>
      <MetricCell label="Rol" value={role ?? '?'} />
      <MetricCell label="M├│dulo" value="Operaciones CRM" />
      <MetricCell label="Mercado" value="Supervisor (lectura)" valueClass="text-brand" />
      {(role === 'HEAD' || role === 'CHIEF') && (
        <div className="px-4 py-2 ml-auto">
          <Link
            to="/dashboard/supervisor-market"
            className="text-xs font-bold text-primary hover:text-primary/80"
          >
            Ver exposici├│n clientes ÔåÆ
          </Link>
        </div>
      )}
    </>
  );
}

interface AccountMetricsBarProps {
  compact?: boolean;
}

export function AccountMetricsBar({ compact = false }: AccountMetricsBarProps) {
  const role = useAuthStore((s) => s.role);

  return (
    <header
      className={`flex flex-wrap items-stretch border-b shrink-0 ${
        compact ? 'min-h-[40px]' : 'min-h-[52px]'
      }`}
      style={{ background: boltTheme.bgPanel, borderColor: boltTheme.border }}
    >
      {role === 'CLIENT' ? <ClientMetrics compact={compact} /> : <StaffMetrics />}
    </header>
  );
}
