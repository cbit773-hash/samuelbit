import { Link } from 'react-router-dom';
import { RefreshCw, ArrowUpCircle } from 'lucide-react';
import { useTradingStore } from '../store/trading.store';
import { resetDemoAccount } from '../../../core/supabase/services/wallet.service';
import { useClientDataOptional } from '../../client/context/ClientDataContext';
import { CLIENT_PATHS } from '../../../shared/routing/paths';
import { DEMO_STARTING_BALANCE } from '../utils/trading-account';
import { useState } from 'react';

export function DemoAccountBanner() {
  const accountMode = useTradingStore((s) => s.accountMode);
  const balance = useTradingStore((s) => s.balance);
  const clientData = useClientDataOptional();
  const [resetting, setResetting] = useState(false);

  if (accountMode === 'demo') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-amber-500/30 bg-amber-500/10 text-xs shrink-0">
        <p className="text-amber-200/90 font-medium">
          Fondos virtuales · ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          {' · '}Sin riesgo real
        </p>
        <button
          type="button"
          disabled={resetting}
          onClick={async () => {
            setResetting(true);
            await resetDemoAccount();
            await clientData?.refreshAll();
            setResetting(false);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 font-bold"
        >
          <RefreshCw size={12} className={resetting ? 'animate-spin' : ''} />
          Reiniciar demo (${DEMO_STARTING_BALANCE.toLocaleString()})
        </button>
      </div>
    );
  }

  if (balance <= 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-primary/30 bg-primary/10 text-xs shrink-0">
        <p className="text-primary/90 font-medium">
          Cuenta <span className="font-bold text-emerald-400">real</span> — deposita fondos para operar con dinero real.
        </p>
        <Link
          to={CLIENT_PATHS.accountTab('depositar')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-polar-white font-bold hover:bg-primary-hover"
        >
          <ArrowUpCircle size={14} />
          Depositar
        </Link>
      </div>
    );
  }

  return null;
}
