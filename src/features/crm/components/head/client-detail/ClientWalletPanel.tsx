import { useState } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { formatUsd } from '../../../../wallet/utils/format-usd';
import type { Wallet as WalletType } from '../../../../../core/supabase/services/wallet.service';
import { setClientWalletBalance, type WalletBook } from '../../../../../core/supabase/services/staff.service';

interface ClientWalletPanelProps {
  clientId: string;
  wallet: WalletType | null;
  onUpdated: () => void;
}

function BalanceRow({
  label,
  value,
  book,
  clientId,
  onUpdated,
}: {
  label: string;
  value: number;
  book: WalletBook;
  clientId: string;
  onUpdated: () => void;
}) {
  const [input, setInput] = useState(String(value));
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const amount = Number(input);
    if (!Number.isFinite(amount) || amount < 0) {
      setError('Monto inválido');
      return;
    }
    if (reason.trim().length < 3) {
      setError('Indica un motivo (mín. 3 caracteres)');
      return;
    }
    setPending(true);
    setError(null);
    try {
      await setClientWalletBalance(clientId, book, amount, reason.trim());
      setOpen(false);
      setReason('');
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar saldo');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-border/50 last:border-0">
      <div>
        <p className="text-xs font-bold text-muted uppercase">{label}</p>
        <p className="text-lg font-mono font-bold text-foreground">{formatUsd(value)}</p>
      </div>
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setInput(String(value));
            setOpen(true);
            setError(null);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-inset border border-border hover:border-brand/40 text-foreground"
        >
          Establecer saldo
        </button>
      ) : (
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[280px]">
          <input
            type="number"
            min={0}
            step="0.01"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border text-sm font-mono"
          />
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo del ajuste"
            className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border text-sm"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => void submit()}
              className="flex-1 px-3 py-2 rounded-lg bg-brand text-brand-ink text-xs font-bold disabled:opacity-50"
            >
              {pending ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Confirmar'}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ClientWalletPanel({ clientId, wallet, onUpdated }: ClientWalletPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
        <Wallet size={16} className="text-brand" />
        Saldos de billetera
      </h3>
      <p className="text-xs text-muted mb-3">Establece el monto exacto en cada libro. Queda registrado en auditoría.</p>
      <BalanceRow
        label="Live (real)"
        value={Number(wallet?.balance ?? 0)}
        book="live"
        clientId={clientId}
        onUpdated={onUpdated}
      />
      <BalanceRow
        label="Demo"
        value={Number(wallet?.demo_balance ?? 0)}
        book="demo"
        clientId={clientId}
        onUpdated={onUpdated}
      />
    </div>
  );
}
