import type { Transaction } from '../../../../../core/supabase/services/wallet.service';
import { formatUsd } from '../../../../wallet/utils/format-usd';

interface ClientTransactionsPanelProps {
  transactions: Transaction[];
}

export function ClientTransactionsPanel({ transactions }: ClientTransactionsPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="font-bold mb-3">Transacciones recientes</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {transactions.length === 0 && <p className="text-sm text-muted">Sin transacciones.</p>}
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex justify-between text-sm border-b border-border/50 pb-2"
          >
            <span className="capitalize">
              {tx.type} · {tx.status}
            </span>
            <span className="font-mono">{formatUsd(Number(tx.amount))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
