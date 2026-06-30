import { useState } from 'react';
import { Loader2, Copy, Check, Upload } from 'lucide-react';
import { supabase } from '../../../core/supabase/client';
import { initiateManualDeposit } from '../../../core/payments/payment.service';
import { LATAM_BANK_ACCOUNTS, LATAM_CLIENT_BANKS } from '../../../shared/constants/latam-company';
import {
  formatLocal,
  formatUsd,
  formatUsdWithLocalEquivalent,
  getLocalUsdRate,
  MIN_CRYPTO_DEPOSIT_USD,
  usdToLocal,
  FX_DISCLAIMER,
} from '../../../shared/utils/currency-latam';

type Step = 1 | 2 | 3 | 4;

interface ManualBankFlowProps {
  onSuccess: () => void;
  setMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
}

export function ManualBankFlow({ onSuccess, setMessage }: ManualBankFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [amountUsd, setAmountUsd] = useState('');
  const [amountLocal, setAmountLocal] = useState('');
  const [companyBankId] = useState<string>(LATAM_BANK_ACCOUNTS[0].id);
  const [clientBank, setClientBank] = useState<string>(LATAM_CLIENT_BANKS[0]);
  const [accountOrigin, setAccountOrigin] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const rate = getLocalUsdRate();
  const usd = parseFloat(amountUsd) || 0;
  const bank = LATAM_BANK_ACCOUNTS.find((b) => b.id === companyBankId) ?? LATAM_BANK_ACCOUNTS[0];

  const syncLocalFromUsd = (val: string) => {
    setAmountUsd(val);
    const n = parseFloat(val);
    if (Number.isFinite(n) && n > 0) setAmountLocal(String(usdToLocal(n, rate)));
    else setAmountLocal('');
  };

  const syncUsdFromLocal = (val: string) => {
    setAmountLocal(val);
    const n = parseFloat(val);
    if (Number.isFinite(n) && n > 0) setAmountUsd(String(Math.round((n / rate) * 100) / 100));
    else setAmountUsd('');
  };

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const submit = async () => {
    if (usd < MIN_CRYPTO_DEPOSIT_USD) {
      setMessage({ type: 'error', text: `Monto mínimo: ${formatUsd(MIN_CRYPTO_DEPOSIT_USD)}` });
      return;
    }
    if (!receiptFile) {
      setMessage({ type: 'error', text: 'Sube el comprobante de transferencia.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesión no válida');

      const tempId = crypto.randomUUID();
      const ext = receiptFile.name.split('.').pop() ?? 'jpg';
      const path = `${user.id}/${tempId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('deposit-receipts')
        .upload(path, receiptFile, { upsert: true });

      if (uploadError) {
        throw new Error('No se pudo subir el comprobante. Intenta de nuevo o contacta soporte.');
      }

      const localDeclared = parseFloat(amountLocal) || usdToLocal(usd, rate);
      const notes = [
        `Banco cliente: ${clientBank}`,
        accountOrigin ? `Cuenta origen: ${accountOrigin}` : null,
        `Cuenta destino: ${bank.bankName} (${bank.currency})`,
        `Monto local declarado: ${formatLocal(localDeclared)}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const result = await initiateManualDeposit({
        amount: usd,
        notes,
        companyBankId,
        clientBank,
        cciOrigin: accountOrigin || undefined,
        amountPenDeclared: localDeclared,
        receiptPath: path,
        gateway: 'manual_bank',
      });

      if ('error' in result) {
        setMessage({ type: 'error', text: result.error });
        return;
      }

      setMessage({
        type: 'success',
        text: `Depósito registrado (#${result.transactionId.slice(0, 8)}). El equipo verificará tu comprobante en 24–48h hábiles.`,
      });
      setStep(1);
      setAmountUsd('');
      setAmountLocal('');
      setReceiptFile(null);
      onSuccess();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Error al registrar depósito' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-inset border border-blue-500/30 p-6 rounded-xl max-w-lg">
      <p className="text-foreground font-bold text-lg mb-1">Transferencia bancaria local</p>
      <p className="text-muted text-sm mb-4">
        Transfiere desde tu banco local. Tu cuenta opera en USD.
      </p>

      <div className="flex gap-1 mb-6">
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <div key={s} className={`h-1 flex-1 rounded ${step >= s ? 'bg-primary' : 'bg-surface'}`} />
        ))}
      </div>

      {step === 1 && (
        <>
          <label className="text-xs text-muted font-bold block mb-1">Monto en USD</label>
          <input
            type="number"
            min={MIN_CRYPTO_DEPOSIT_USD}
            value={amountUsd}
            onChange={(e) => syncLocalFromUsd(e.target.value)}
            placeholder={`Mín. ${formatUsd(MIN_CRYPTO_DEPOSIT_USD)}`}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono mb-2"
          />
          <label className="text-xs text-muted font-bold block mb-1">Equivalente moneda local (referencial)</label>
          <input
            type="number"
            value={amountLocal}
            onChange={(e) => syncUsdFromLocal(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono mb-2"
          />
          <p className="text-[10px] text-muted mb-4">{FX_DISCLAIMER}</p>
          {usd >= MIN_CRYPTO_DEPOSIT_USD && (
            <p className="text-sm text-primary/90 mb-4">{formatUsdWithLocalEquivalent(usd, rate)}</p>
          )}
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={usd < MIN_CRYPTO_DEPOSIT_USD}
            className="w-full bg-primary hover:bg-primary disabled:opacity-50 text-polar-white font-bold py-3 rounded-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="text-xs text-muted font-bold block mb-2">Transfiere a esta cuenta InvestPRO</label>
          <div className="bg-surface rounded-lg p-4 space-y-3 text-sm mb-4">
            {[
              ['Titular', bank.holder],
              ['Referencia', bank.accountRef],
              ['Moneda cuenta', bank.currency],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2">
                <span className="text-muted">{label}</span>
                <span className="text-foreground font-mono text-right flex items-center gap-2">
                  {value}
                  <button type="button" onClick={() => copyText(String(value), label)} className="text-brand">
                    {copied === label ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg bg-surface text-foreground">
              Atrás
            </button>
            <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg bg-primary text-polar-white font-bold">
              Ya transferí
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <label className="text-xs text-muted font-bold block mb-1">Tu banco de origen</label>
          <select
            value={clientBank}
            onChange={(e) => setClientBank(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground mb-4"
          >
            {LATAM_CLIENT_BANKS.map((b) => (
              <option key={b} value={b} className="bg-surface-inset">
                {b}
              </option>
            ))}
          </select>
          <label className="text-xs text-muted font-bold block mb-1">Referencia cuenta origen (opcional)</label>
          <input
            value={accountOrigin}
            onChange={(e) => setAccountOrigin(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono mb-4"
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg bg-surface text-foreground">
              Atrás
            </button>
            <button type="button" onClick={() => setStep(4)} className="flex-1 py-3 rounded-lg bg-primary text-polar-white font-bold">
              Continuar
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <label className="text-xs text-muted font-bold block mb-2 flex items-center gap-2">
            <Upload size={14} /> Comprobante
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-muted mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-polar-white"
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg bg-surface text-foreground">
              Atrás
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading || !receiptFile}
              className="flex-1 py-3 rounded-lg bg-primary text-polar-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              Enviar solicitud
            </button>
          </div>
        </>
      )}
    </div>
  );
}
