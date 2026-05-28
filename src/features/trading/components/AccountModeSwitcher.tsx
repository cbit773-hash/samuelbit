import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTradingStore, type AccountMode } from '../store/trading.store';
import { switchAccountMode } from '../../../core/supabase/services/wallet.service';
import { useClientDataOptional } from '../../client/context/ClientDataContext';
interface AccountModeSwitcherProps {
  compact?: boolean;
}

export function AccountModeSwitcher({ compact = false }: AccountModeSwitcherProps) {
  const accountMode = useTradingStore((s) => s.accountMode);
  const setAccountMode = useTradingStore((s) => s.setAccountMode);
  const setBalance = useTradingStore((s) => s.setBalance);
  const clientData = useClientDataOptional();
  const [loading, setLoading] = useState(false);

  const handleSwitch = async (mode: AccountMode) => {
    if (mode === accountMode || loading) return;
    setLoading(true);
    try {
      const result = await switchAccountMode(mode);
      setAccountMode(mode);
      if (result) {
        setBalance(
          mode === 'demo' ? Number(result.demo_balance) : Number(result.balance),
        );
      }
      await clientData?.refreshAll();
    } catch (e) {
      console.error('[AccountModeSwitcher]', e);
    } finally {
      setLoading(false);
    }
  };

  const btnClass = (active: boolean, variant: 'demo' | 'live') =>
    `px-3 py-1 rounded-md text-xs font-bold transition-colors ${
      active
        ? variant === 'demo'
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        : 'text-muted hover:text-foreground border border-transparent'
    } ${compact ? 'py-0.5 px-2 text-[10px]' : ''}`;

  return (
    <div className="flex items-center gap-1.5">
      {loading && <Loader2 className="animate-spin text-muted" size={14} />}
      <div
        className="flex rounded-lg p-0.5 border border-border bg-surface-inset/50"
        role="group"
        aria-label="Modo de cuenta"
      >
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleSwitch('demo')}
          className={btnClass(accountMode === 'demo', 'demo')}
        >
          Demo
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleSwitch('live')}
          className={btnClass(accountMode === 'live', 'live')}
        >
          Real
        </button>
      </div>
    </div>
  );
}

/** Balance activo seg├║n modo (para displays) */
export function useActiveTradingBalance(): number {
  return useTradingStore((s) => s.balance);
}
