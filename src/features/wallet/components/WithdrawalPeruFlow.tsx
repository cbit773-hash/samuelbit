import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { initiateWithdrawal } from '../../../core/payments/payment.service';
import { getMyPayoutProfile } from '../../../core/supabase/services/client-payout-profile.service';
import { PERU_CLIENT_BANKS } from '../../../shared/constants/peru-company';
import { formatUsd, MIN_WITHDRAWAL_USD } from '../../../shared/utils/currency-pe';
import { CLIENT_PATHS } from '../../../shared/routing/paths';

const CCI_RE = /^[\d-]{8,30}$/;
const HOLDER_RE = /^[\p{L}\s.'-]{3,80}$/u;

interface WithdrawalPeruFlowProps {
  balance: number;
  isFrozen?: boolean;
  onSuccess: () => void;
  setMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
}

export function WithdrawalPeruFlow({
  balance,
  isFrozen,
  onSuccess,
  setMessage,
}: WithdrawalPeruFlowProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bank' | 'crypto'>('bank');
  const [bank, setBank] = useState<string>(PERU_CLIENT_BANKS[0]);
  const [cci, setCci] = useState('');
  const [holder, setHolder] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setProfileLoading(true);
      const profile = await getMyPayoutProfile();
      setPayoutStatus(profile?.status ?? null);
      if (profile?.status === 'approved') {
        if (profile.bank_name) setBank(profile.bank_name);
        if (profile.bank_cci) setCci(profile.bank_cci);
        if (profile.account_holder) setHolder(profile.account_holder);
        if (profile.crypto_address) setCryptoAddress(profile.crypto_address);
      }
      setProfileLoading(false);
    })();
  }, []);

  const bankBlocked = method === 'bank' && payoutStatus !== 'approved';

  const submit = async () => {
    const n = parseFloat(amount);
    if (!n || n < MIN_WITHDRAWAL_USD) {
      setMessage({ type: 'error', text: `Retiro mínimo: ${formatUsd(MIN_WITHDRAWAL_USD)}` });
      return;
    }
    if (method === 'bank') {
      if (bankBlocked) {
        setMessage({
          type: 'error',
          text: 'Tu perfil bancario debe estar aprobado por compliance antes de retirar.',
        });
        return;
      }
      if (!CCI_RE.test(cci.trim())) {
        setMessage({ type: 'error', text: 'Ingresa un CCI válido (mín. 8 caracteres).' });
        return;
      }
      if (!HOLDER_RE.test(holder.trim())) {
        setMessage({ type: 'error', text: 'Ingresa el titular de la cuenta como aparece en el banco.' });
        return;
      }
    } else if (!cryptoAddress.trim()) {
      setMessage({ type: 'error', text: 'Ingresa la dirección USDT TRC20.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await initiateWithdrawal({
      amount: n,
      method,
      cryptoAddress: method === 'crypto' ? cryptoAddress : undefined,
      cryptoNetwork: method === 'crypto' ? 'TRC20' : undefined,
      withdrawalBank: method === 'bank' ? bank : undefined,
      withdrawalCci: method === 'bank' ? cci.trim() : undefined,
      withdrawalHolder: method === 'bank' ? holder.trim() : undefined,
      notes: method === 'bank' ? `Retiro a ${bank} — ${cci.trim()}` : undefined,
    });

    setLoading(false);

    if ('error' in result) {
      setMessage({ type: 'error', text: result.error });
      return;
    }

    setMessage({
      type: 'success',
      text: 'Retiro solicitado. Procesamiento en 24-48 horas hábiles (horario Perú).',
    });
    setAmount('');
    if (payoutStatus !== 'approved') {
      setCci('');
      setHolder('');
    }
    setCryptoAddress(payoutStatus === 'approved' ? cryptoAddress : '');
    onSuccess();
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center py-12 text-muted">
        <Loader2 className="animate-spin mr-2" size={22} />
        Cargando datos de retiro…
      </div>
    );
  }

  return (
    <div className="bg-surface-inset border border-border p-6 rounded-xl max-w-lg mx-auto">
      {bankBlocked && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm p-3 rounded-xl flex gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>
            {payoutStatus === 'pending'
              ? 'Tu cuenta bancaria está en revisión. '
              : payoutStatus === 'rejected'
                ? 'Tu perfil bancario fue rechazado. '
                : 'Registra tu cuenta bancaria en Mi perfil. '}
            <Link to={CLIENT_PATHS.accountTab('perfil')} className="text-brand font-semibold hover:underline">
              Ir a Mi perfil
            </Link>
          </span>
        </div>
      )}

      <p className="text-muted text-sm mb-4">
        Disponible: <span className="text-foreground font-bold font-mono">{formatUsd(balance)}</span>
      </p>
      <input
        type="number"
        min={MIN_WITHDRAWAL_USD}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Monto (mín. ${formatUsd(MIN_WITHDRAWAL_USD)})`}
        className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground text-lg font-mono outline-none focus:border-primary mb-4"
      />
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as 'bank' | 'crypto')}
        className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground outline-none focus:border-primary mb-4"
      >
        <option value="bank">Transferencia bancaria (CCI Perú)</option>
        <option value="crypto">USDT (TRC20)</option>
      </select>

      {method === 'bank' ? (
        <div className="space-y-3 mb-4">
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            disabled={bankBlocked}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground disabled:opacity-60"
          >
            {PERU_CLIENT_BANKS.map((b) => (
              <option key={b} value={b} className="bg-surface-inset">
                {b}
              </option>
            ))}
          </select>
          <input
            value={cci}
            onChange={(e) => setCci(e.target.value)}
            placeholder="CCI de destino *"
            disabled={bankBlocked}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm disabled:opacity-60"
          />
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            placeholder="Titular de la cuenta *"
            disabled={bankBlocked}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground text-sm disabled:opacity-60"
          />
        </div>
      ) : (
        <input
          type="text"
          value={cryptoAddress}
          onChange={(e) => setCryptoAddress(e.target.value)}
          placeholder="Dirección USDT TRC20"
          className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm outline-none focus:border-primary mb-4"
        />
      )}

      <button
        type="button"
        onClick={submit}
        disabled={loading || isFrozen || (method === 'bank' && bankBlocked)}
        className="w-full bg-primary-hover hover:bg-primary disabled:opacity-50 text-foreground font-black py-3 rounded-lg flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : null}
        Enviar solicitud
      </button>
      <p className="text-muted text-xs mt-3 text-center">Horario de procesamiento: Lima (UTC-5).</p>
    </div>
  );
}
