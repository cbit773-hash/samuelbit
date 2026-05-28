import { useState } from 'react';
import { Loader2, Copy, Check, Upload } from 'lucide-react';
import { supabase } from '../../../core/supabase/client';
import { initiateManualDeposit } from '../../../core/payments/payment.service';
import { PERU_BANK_ACCOUNTS, PERU_CLIENT_BANKS } from '../../../shared/constants/peru-company';
import {
  formatPen,
  formatUsd,
  formatUsdWithPenEquivalent,
  getPenUsdRate,
  MIN_CRYPTO_DEPOSIT_USD,
  usdToPen,
  FX_DISCLAIMER,
} from '../../../shared/utils/currency-pe';

type Step = 1 | 2 | 3 | 4;

interface ManualDepositPeruFlowProps {
  onSuccess: () => void;
  setMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
}

export function ManualDepositPeruFlow({ onSuccess, setMessage }: ManualDepositPeruFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [amountUsd, setAmountUsd] = useState('');
  const [amountPen, setAmountPen] = useState('');
  const [companyBankId, setCompanyBankId] = useState<string>(PERU_BANK_ACCOUNTS[0].id);
  const [clientBank, setClientBank] = useState<string>(PERU_CLIENT_BANKS[0]);
  const [cciOrigin, setCciOrigin] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const rate = getPenUsdRate();
  const usd = parseFloat(amountUsd) || 0;
  const bank = PERU_BANK_ACCOUNTS.find((b) => b.id === companyBankId) ?? PERU_BANK_ACCOUNTS[0];

  const syncPenFromUsd = (val: string) => {
    setAmountUsd(val);
    const n = parseFloat(val);
    if (Number.isFinite(n) && n > 0) setAmountPen(String(usdToPen(n, rate)));
    else setAmountPen('');
  };

  const syncUsdFromPen = (val: string) => {
    setAmountPen(val);
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
      setMessage({ type: 'error', text: 'Sube el comprobante de transferencia (voucher).' });
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

      const penDeclared = parseFloat(amountPen) || usdToPen(usd, rate);
      const notes = [
        `Banco cliente: ${clientBank}`,
        cciOrigin ? `CCI origen: ${cciOrigin}` : null,
        `Cuenta destino: ${bank.bankName} (${bank.currency})`,
        `Monto declarado PEN: ${formatPen(penDeclared)}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const result = await initiateManualDeposit({
        amount: usd,
        notes,
        companyBankId,
        clientBank,
        cciOrigin: cciOrigin || undefined,
        amountPenDeclared: penDeclared,
        receiptPath: path,
      });

      if ('error' in result) {
        setMessage({ type: 'error', text: result.error });
        return;
      }

      setMessage({
        type: 'success',
        text: `Depósito registrado (#${result.transactionId.slice(0, 8)}). El equipo verificará tu voucher en horario hábil Perú (24–48h).`,
      });
      setStep(1);
      setAmountUsd('');
      setAmountPen('');
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
      <p className="text-foreground font-bold text-lg mb-1">Transferencia desde tu banco en Perú</p>
      <p className="text-muted text-sm mb-4">
        Yape/Plin no están habilitados. Usa transferencia interbancaria o ventanilla.
      </p>

      <div className="flex gap-1 mb-6">
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded ${step >= s ? 'bg-primary' : 'bg-surface'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <label className="text-xs text-muted font-bold block mb-1">Monto en USD (cuenta opera en USD)</label>
          <input
            type="number"
            min={MIN_CRYPTO_DEPOSIT_USD}
            value={amountUsd}
            onChange={(e) => syncPenFromUsd(e.target.value)}
            placeholder={`Mín. ${formatUsd(MIN_CRYPTO_DEPOSIT_USD)}`}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono mb-2"
          />
          <label className="text-xs text-muted font-bold block mb-1">Equivalente en soles (referencial)</label>
          <input
            type="number"
            value={amountPen}
            onChange={(e) => syncUsdFromPen(e.target.value)}
            placeholder="S/ 0.00"
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground font-mono mb-2"
          />
          <p className="text-[10px] text-muted mb-4">{FX_DISCLAIMER}</p>
          {usd >= MIN_CRYPTO_DEPOSIT_USD && (
            <p className="text-sm text-primary/90 mb-4">{formatUsdWithPenEquivalent(usd, rate)}</p>
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
          <select
            value={companyBankId}
            onChange={(e) => setCompanyBankId(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded-lg px-4 py-3 text-foreground mb-4"
          >
            {PERU_BANK_ACCOUNTS.map((b) => (
              <option key={b.id} value={b.id} className="bg-surface-inset">
                {b.bankName} · {b.currency}
              </option>
            ))}
          </select>
          <div className="bg-surface rounded-lg p-4 space-y-3 text-sm mb-4">
            {[
              ['Titular', bank.holder],
              ['RUC', bank.ruc],
              ['CCI', bank.cci],
              ['Moneda cuenta', bank.currency],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2">
                <span className="text-muted">{label}</span>
                <span className="text-foreground font-mono text-right flex items-center gap-2">
                  {value}
                  <button
                    type="button"
                    onClick={() => copyText(String(value), label)}
                    className="text-brand hover:text-brand-hover"
                  >
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
            {PERU_CLIENT_BANKS.map((b) => (
              <option key={b} value={b} className="bg-surface-inset">
                {b}
              </option>
            ))}
          </select>
          <label className="text-xs text-muted font-bold block mb-1">CCI origen (opcional)</label>
          <input
            value={cciOrigin}
            onChange={(e) => setCciOrigin(e.target.value)}
            placeholder="002-xxx-... o 003-xxx-..."
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
            <Upload size={14} /> Comprobante (voucher)
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
