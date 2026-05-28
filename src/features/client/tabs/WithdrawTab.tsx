import { useState } from 'react';
import { ArrowDownCircle, Loader2 } from 'lucide-react';
import { initiateWithdrawal } from '../../../core/payments';
import { useClientData } from '../context/ClientDataContext';
import { formatUsd } from '../../wallet/utils/format-usd';
import { ActionBanner, type ActionMessage } from '../components/ActionBanner';

interface WithdrawTabProps {
  actionMessage: ActionMessage;
  onActionMessage: (msg: ActionMessage) => void;
}

export function WithdrawTab({ actionMessage, onActionMessage }: WithdrawTabProps) {
  const { wallet, refreshWallet } = useClientData();
  const balance = wallet?.balance ?? 0;

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'crypto'>('bank');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 50) {
      onActionMessage({ type: 'error', text: 'Retiro mínimo: $50 USD' });
      return;
    }
    if (withdrawMethod === 'crypto' && !cryptoAddress.trim()) {
      onActionMessage({ type: 'error', text: 'Ingresa la dirección crypto de destino' });
      return;
    }
    setActionLoading(true);
    onActionMessage(null);
    const result = await initiateWithdrawal({
      amount,
      method: withdrawMethod,
      cryptoAddress: withdrawMethod === 'crypto' ? cryptoAddress : undefined,
      cryptoNetwork: withdrawMethod === 'crypto' ? 'TRC20' : undefined,
    });
    setActionLoading(false);
    if ('error' in result) {
      onActionMessage({ type: 'error', text: result.error });
      return;
    }
    onActionMessage({
      type: 'success',
      text: 'Retiro solicitado. Será procesado en 24-48h hábiles.',
    });
    setWithdrawAmount('');
    setCryptoAddress('');
    void refreshWallet();
  };

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-brand mb-6 flex items-center gap-2">
        <ArrowDownCircle /> Solicitar Retiro
      </h3>
      <ActionBanner message={actionMessage} />
      <div className="bg-surface-inset border border-border p-6 rounded-xl max-w-lg mx-auto">
        <p className="text-muted text-sm mb-4">
          Disponible: <span className="text-foreground font-bold">{formatUsd(balance)}</span>
        </p>
        <input
          type="number"
          min={50}
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Monto a retirar (mín. $50)"
          className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground text-lg font-mono outline-none focus:border-brand mb-4"
        />
        <select
          value={withdrawMethod}
          onChange={(e) => setWithdrawMethod(e.target.value as 'bank' | 'crypto')}
          className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground outline-none focus:border-brand mb-4"
        >
          <option value="bank">Transferencia Bancaria</option>
          <option value="crypto">USDT (TRC20)</option>
        </select>
        {withdrawMethod === 'crypto' && (
          <input
            type="text"
            value={cryptoAddress}
            onChange={(e) => setCryptoAddress(e.target.value)}
            placeholder="Dirección USDT TRC20"
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm outline-none focus:border-brand mb-4"
          />
        )}
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={actionLoading || wallet?.is_frozen}
          className="w-full bg-accent-lime/600 hover:bg-primary-hover disabled:opacity-50 text-foreground font-black py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {actionLoading ? <Loader2 size={20} className="animate-spin" /> : null}
          Enviar Solicitud
        </button>
        <p className="text-muted text-xs mt-3 text-center">Procesamiento: 24-48 horas hábiles.</p>
      </div>
    </div>
  );
}
