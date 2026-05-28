import { History } from 'lucide-react';
import { TransactionList } from '../../wallet/components/TransactionList';
import { useClientData } from '../context/ClientDataContext';

export function TransactionsTab() {
  const { transactions, refreshWallet } = useClientData();

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-purple-500 flex items-center gap-2">
          <History /> Historial de Movimientos
        </h3>
        <button
          type="button"
          onClick={() => void refreshWallet()}
          className="text-cyan-400 text-sm font-bold hover:text-cyan-300"
        >
          Actualizar
        </button>
      </div>
      <TransactionList transactions={transactions} />
    </div>
  );
}
