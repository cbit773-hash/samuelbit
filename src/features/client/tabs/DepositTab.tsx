import { useState } from 'react';
import { useClientData } from '../context/ClientDataContext';
import { formatUsd } from '../../wallet/utils/format-usd';
import { ActionBanner, type ActionMessage } from '../components/ActionBanner';
import { DepositContextBanner } from '../components/DepositContextBanner';
import { CryptoDepositSection } from '../components/CryptoDepositSection';
import { DepositTrustFooter } from '../components/DepositTrustFooter';
import { ManualDepositPeruFlow } from '../../wallet/components/ManualDepositPeruFlow';
import { BoltCard } from '../../../shared/ui/BoltCard';

interface DepositTabProps {
  actionMessage: ActionMessage;
  onActionMessage: (msg: ActionMessage) => void;
}

type DepositMethod = 'crypto' | 'manual';

export function DepositTab({ actionMessage, onActionMessage }: DepositTabProps) {
  const { wallet, refreshAll } = useClientData();
  const realBalance = Number(wallet?.balance ?? 0);
  const [depositMethod, setDepositMethod] = useState<DepositMethod>('crypto');

  return (
    <div className="space-y-6 animate-fade-in">
      <BoltCard className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-1">Depositar fondos</h3>
        <p className="text-muted text-sm">
          Balance real acreditado:{' '}
          <span className="text-foreground font-mono font-bold">{formatUsd(realBalance)}</span>
        </p>
      </BoltCard>

      <DepositContextBanner />
      <ActionBanner message={actionMessage} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDepositMethod('crypto')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
            depositMethod === 'crypto'
              ? 'bg-primary text-polar-white'
              : 'bg-surface-inset text-muted hover:text-foreground'
          }`}
        >
          Criptomonedas
        </button>
        <button
          type="button"
          onClick={() => setDepositMethod('manual')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
            depositMethod === 'manual'
              ? 'bg-primary text-polar-white'
              : 'bg-surface-inset text-muted hover:text-foreground'
          }`}
        >
          Transferencia Perú
        </button>
      </div>

      {depositMethod === 'crypto' ? (
        <CryptoDepositSection onMessage={onActionMessage} />
      ) : (
        <ManualDepositPeruFlow
          onSuccess={() => void refreshAll()}
          setMessage={onActionMessage}
        />
      )}

      <DepositTrustFooter />
    </div>
  );
}
