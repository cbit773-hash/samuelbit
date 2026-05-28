import { ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClientData } from '../context/ClientDataContext';
import { formatUsd } from '../../wallet/utils/format-usd';
import { CLIENT_PATHS } from '../../../shared/routing/paths';
import { useTradingStore } from '../../trading/store/trading.store';
import { calcFloatingPnl } from '../../trading/utils/position-mappers';

export function AccountSummaryTab() {
  const {
    wallet,
    transactions,
    kpis,
    refreshAll,
    openPositions,
  } = useClientData();

  const storeOpen = useTradingStore((s) => s.positions);
  const currentPrice = useTradingStore((s) => s.currentPrice);
  const floatingPnl = storeOpen.reduce(
    (sum, p) => sum + calcFloatingPnl(p, currentPrice),
    0,
  );

  const balance = wallet?.balance ?? 0;
  const totalDeposited = wallet?.total_deposited ?? 0;
  const totalWithdrawn = wallet?.total_withdrawn ?? 0;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-alt border border-border p-8 rounded-2xl relative overflow-hidden">
          <p className="text-muted text-sm font-semibold mb-2">Balance Total</p>
          <p className="text-5xl font-black text-foreground font-mono">{formatUsd(balance)}</p>
          <p className="text-brand text-xs mt-3 font-bold">USD | Billetera InvestPRO</p>
        </div>
        <div className="bg-surface-alt border border-emerald-500/20 p-8 rounded-2xl">
          <p className="text-muted text-sm font-semibold mb-2">Total Depositado</p>
          <p className="text-5xl font-black text-emerald-500 font-mono">{formatUsd(totalDeposited)}</p>
        </div>
        <div className="bg-surface-alt border border-border p-8 rounded-2xl">
          <p className="text-muted text-sm font-semibold mb-2">Disponible para Retiro</p>
          <p className="text-5xl font-black text-foreground font-mono">{formatUsd(balance)}</p>
          {wallet?.is_frozen && (
            <p className="text-red-400 text-xs mt-3 font-bold">Billetera congelada</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-alt border border-border p-5 rounded-xl text-center">
          <p className="text-muted text-xs font-bold mb-1">Transacciones</p>
          <p className="text-3xl font-black text-foreground">{transactions.length}</p>
        </div>
        <div className="bg-surface-alt border border-border p-5 rounded-xl text-center">
          <p className="text-muted text-xs font-bold mb-1">Pendientes</p>
          <p className="text-3xl font-black text-brand">
            {transactions.filter((t) => t.status === 'pending' || t.status === 'processing').length}
          </p>
        </div>
        <div className="bg-surface-alt border border-border p-5 rounded-xl text-center">
          <p className="text-muted text-xs font-bold mb-1">Completados</p>
          <p className="text-3xl font-black text-emerald-500">
            {transactions.filter((t) => t.status === 'completed').length}
          </p>
        </div>
        <div className="bg-surface-alt border border-border p-5 rounded-xl text-center">
          <p className="text-muted text-xs font-bold mb-1">Total Retirado</p>
          <p className="text-3xl font-black text-foreground">{formatUsd(totalWithdrawn)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xl">
          <p className="text-muted text-xs font-bold mb-1">Posiciones abiertas</p>
          <p className="text-3xl font-black text-emerald-400">{openPositions.length || kpis.openPositions}</p>
        </div>
        <div className="bg-surface-alt border border-border p-5 rounded-xl">
          <p className="text-muted text-xs font-bold mb-1">PnL flotante (live)</p>
          <p className={`text-3xl font-black font-mono ${floatingPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {floatingPnl >= 0 ? '+' : ''}{formatUsd(floatingPnl)}
          </p>
        </div>
        <div className="bg-surface-alt border border-border p-5 rounded-xl">
          <p className="text-muted text-xs font-bold mb-1">PnL realizado</p>
          <p className={`text-3xl font-black font-mono ${kpis.totalPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {kpis.totalPnl >= 0 ? '+' : ''}{formatUsd(kpis.totalPnl)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <Link
          to={CLIENT_PATHS.trade}
          className="text-sm bg-cyan-600 hover:bg-cyan-500 text-foreground font-bold px-4 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <ExternalLink size={16} /> Abrir terminal de trading
        </Link>
        <button
          type="button"
          onClick={() => void refreshAll()}
          className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1"
        >
          <RefreshCw size={14} /> Actualizar todo
        </button>
      </div>
    </div>
  );
}
