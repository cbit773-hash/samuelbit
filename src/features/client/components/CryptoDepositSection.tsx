import { useState } from 'react';
import { Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import {
  initiateCryptoDeposit,
  initiateDirectCryptoDeposit,
  RECOMMENDED_CRYPTOS,
} from '../../../core/payments';
import { BoltButton } from '../../../shared/ui/BoltButton';
import { BoltCard } from '../../../shared/ui/BoltCard';
import {
  formatUsd,
  MIN_CRYPTO_DEPOSIT_USD,
  FX_DISCLAIMER,
} from '../../../shared/utils/currency-pe';
import type { ActionMessage } from './ActionBanner';

type CryptoSubMode = 'invoice' | 'direct';

interface CryptoDepositSectionProps {
  onMessage: (msg: ActionMessage) => void;
}

export function CryptoDepositSection({ onMessage }: CryptoDepositSectionProps) {
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<string>('usdttrc20');
  const [subMode, setSubMode] = useState<CryptoSubMode>('invoice');
  const [loading, setLoading] = useState(false);
  const [directResult, setDirectResult] = useState<{
    payAddress: string;
    payAmount: number;
    payCurrency: string;
    transactionId: string;
    expiresAt: string | null;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const popular = RECOMMENDED_CRYPTOS.filter((c) => c.popular);

  const handleSubmit = async () => {
    const usd = parseFloat(amount);
    if (!usd || usd < MIN_CRYPTO_DEPOSIT_USD) {
      onMessage({ type: 'error', text: `Monto mínimo: ${formatUsd(MIN_CRYPTO_DEPOSIT_USD)}` });
      return;
    }
    if (usd > 100000) {
      onMessage({ type: 'error', text: 'Monto máximo: $100,000 USD' });
      return;
    }

    setLoading(true);
    onMessage(null);
    setDirectResult(null);

    if (subMode === 'invoice') {
      const result = await initiateCryptoDeposit({ amount: usd });
      setLoading(false);
      if ('error' in result) {
        onMessage({ type: 'error', text: result.error });
        return;
      }
      window.location.href = result.paymentUrl;
      return;
    }

    const result = await initiateDirectCryptoDeposit({
      amount: usd,
      cryptoCurrency: selectedCrypto,
    });
    setLoading(false);
    if ('error' in result) {
      onMessage({ type: 'error', text: result.error });
      return;
    }
    setDirectResult(result);
    onMessage({
      type: 'success',
      text: `Orden #${result.transactionId.slice(0, 8)} creada. Envía el monto exacto a la dirección indicada.`,
    });
  };

  const copyAddress = async () => {
    if (!directResult?.payAddress) return;
    await navigator.clipboard.writeText(directResult.payAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BoltCard className="p-6 max-w-lg">
      <p className="text-foreground font-bold text-lg">Depósito con criptomonedas</p>
      <p className="text-muted text-sm mt-1 mb-4">
        Cuenta en USD. Pasarela NOWPayments o depósito directo a dirección on-chain.
      </p>

      <p className="text-[10px] text-muted uppercase font-bold mb-2">Activo</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {popular.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => setSelectedCrypto(c.code)}
            className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${
              selectedCrypto === c.code
                ? 'bg-primary text-polar-white'
                : 'bg-surface-inset text-muted hover:text-foreground'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="flex gap-1 p-0.5 rounded-lg bg-surface-inset/50 border border-border mb-4">
        <button
          type="button"
          onClick={() => {
            setSubMode('invoice');
            setDirectResult(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-md ${
            subMode === 'invoice' ? 'bg-primary text-polar-white' : 'text-muted'
          }`}
        >
          Pasarela (todas las monedas)
        </button>
        <button
          type="button"
          onClick={() => setSubMode('direct')}
          className={`flex-1 py-2 text-xs font-bold rounded-md ${
            subMode === 'direct' ? 'bg-primary text-polar-white' : 'text-muted'
          }`}
        >
          Depósito directo
        </button>
      </div>

      <label className="text-xs text-muted font-bold block mb-1">Monto USD</label>
      <input
        type="number"
        min={MIN_CRYPTO_DEPOSIT_USD}
        max={100000}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Mín. ${formatUsd(MIN_CRYPTO_DEPOSIT_USD)}`}
        className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground text-lg font-mono outline-none focus:border-primary mb-4"
      />

      {subMode === 'direct' && directResult && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 mb-4 space-y-3">
          <p className="text-xs text-muted uppercase font-bold">Envía exactamente</p>
          <p className="font-mono text-lg text-foreground font-bold">
            {directResult.payAmount} {directResult.payCurrency.toUpperCase()}
          </p>
          <div className="flex gap-2 items-start">
            <p className="font-mono text-xs text-foreground break-all flex-1">
              {directResult.payAddress}
            </p>
            <button
              type="button"
              onClick={() => void copyAddress()}
              className="shrink-0 p-2 rounded-lg border border-border text-brand hover:bg-surface"
              aria-label="Copiar dirección"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          {directResult.expiresAt && (
            <p className="text-[10px] text-muted">
              Válido hasta: {new Date(directResult.expiresAt).toLocaleString('es-PE')}
            </p>
          )}
        </div>
      )}

      <BoltButton
        variant="primary"
        fullWidth
        disabled={loading}
        onClick={() => void handleSubmit()}
        className="flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : subMode === 'invoice' ? (
          <ExternalLink size={18} />
        ) : null}
        {subMode === 'invoice' ? 'Pagar con pasarela NOWPayments' : 'Generar dirección de depósito'}
      </BoltButton>

      <p className="text-[10px] text-muted mt-3 leading-snug">{FX_DISCLAIMER}</p>
    </BoltCard>
  );
}
