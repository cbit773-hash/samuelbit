import { TX_STATUS_COLORS, TX_STATUS_LABELS } from '../constants/transaction-status';

export function TransactionStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded ${TX_STATUS_COLORS[status] ?? 'bg-gray-500/20 text-muted'}`}>
      {TX_STATUS_LABELS[status] ?? status}
    </span>
  );
}
