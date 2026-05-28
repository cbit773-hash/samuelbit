import { Link } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';
import { formatUsd, MIN_CRYPTO_DEPOSIT_USD } from '../../../shared/utils/currency-pe';
import { CLIENT_PATHS } from '../../../shared/routing/paths';

export function DepositTrustFooter() {
  return (
    <footer className="mt-8 pt-6 border-t border-border flex flex-wrap gap-4 items-start text-[11px] text-muted">
      <div className="flex items-center gap-2">
        <Lock size={14} className="text-brand shrink-0" />
        <span>Conexión cifrada (SSL). Fondos acreditados en USD.</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield size={14} className="text-brand shrink-0" />
        <span>
          Mínimo crypto: {formatUsd(MIN_CRYPTO_DEPOSIT_USD)} · Máx. $100,000. Transferencia manual:
          verificación 24–48h hábiles (Perú).
        </span>
      </div>
      <Link
        to={CLIENT_PATHS.legal}
        className="text-brand hover:underline font-semibold"
      >
        Aviso de riesgos CFD
      </Link>
    </footer>
  );
}
