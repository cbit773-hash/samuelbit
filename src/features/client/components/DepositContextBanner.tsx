import { Link } from 'react-router-dom';
import { ArrowUpCircle, Info } from 'lucide-react';
import { useClientData } from '../context/ClientDataContext';
import { useTradingStore } from '../../trading/store/trading.store';
import { useKyc } from '../../kyc/hooks/useKyc';
import { CLIENT_PATHS } from '../../../shared/routing/paths';
import { formatUsd } from '../../wallet/utils/format-usd';

export function DepositContextBanner() {
  const { wallet } = useClientData();
  const accountMode = useTradingStore((s) => s.accountMode);
  const { status: kycStatus } = useKyc();

  const realBalance = Number(wallet?.balance ?? 0);
  const showLiveZero = accountMode === 'live' && realBalance <= 0;
  const showDemoHint = accountMode === 'demo';
  const kycNeedsAttention = kycStatus !== 'verified' && kycStatus !== 'submitted';

  if (!showLiveZero && !showDemoHint && !kycNeedsAttention) return null;

  return (
    <div className="space-y-2 mb-6">
      {showDemoHint && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex gap-3">
          <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-100/90 leading-snug">
            El depósito acredita en tu <strong>cuenta real</strong> (USD). La cuenta demo ($10,000
            virtual) es solo para practicar en el terminal.
          </p>
        </div>
      )}
      {showLiveZero && (
        <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-primary/90 font-medium">
            Deposita para operar con dinero real. Balance actual:{' '}
            <span className="font-mono font-bold">{formatUsd(realBalance)}</span>
          </p>
          <Link
            to={CLIENT_PATHS.trade}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover"
          >
            <ArrowUpCircle size={14} />
            Ir al terminal
          </Link>
        </div>
      )}
      {kycNeedsAttention && (
        <p className="text-xs text-muted">
          <Link to={CLIENT_PATHS.accountTab('seguridad')} className="text-brand hover:underline">
            Verifica tu identidad (KYC)
          </Link>{' '}
          — recomendado antes de retirar fondos.
        </p>
      )}
    </div>
  );
}
