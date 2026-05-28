import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { Transaction } from '../../../core/supabase/services/wallet.service';
import { formatUsd } from '../hooks/useWalletData';
import { TransactionStatusBadge } from './TransactionStatusBadge';

interface TransactionListProps {
  transactions: Transaction[];
  emptyMessage?: string;
}

export function TransactionList({ transactions, emptyMessage = 'Sin movimientos registrados.' }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="text-muted text-center py-8">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const isDeposit = tx.type === 'deposit';
        const col = isDeposit ? 'text-emerald-500' : 'text-brand';
        const bg = isDeposit ? 'bg-emerald-500/10' : 'bg-accent-lime/10';
        const sign = isDeposit ? '+' : '-';
        const date = new Date(tx.created_at).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={tx.id} className="bg-surface-inset p-4 rounded-xl border border-border flex justify-between items-center gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                {isDeposit ? <ArrowUpCircle size={18} className={col} /> : <ArrowDownCircle size={18} className={col} />}
              </div>
              <div className="min-w-0">
                <p className="text-foreground font-bold">
                  {isDeposit ? 'Depósito' : 'Retiro'}
                  {tx.gateway === 'nowpayments' && ' (Crypto)'}
                  {tx.gateway === 'manual' && ' (Manual)'}
                </p>
                <p className="text-muted text-xs">{date}</p>
                {tx.notes && <p className="text-muted text-xs truncate mt-0.5">{tx.notes}</p>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-mono font-bold ${col}`}>
                {sign}{formatUsd(Number(tx.net_amount))}
              </p>
              <TransactionStatusBadge status={tx.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
