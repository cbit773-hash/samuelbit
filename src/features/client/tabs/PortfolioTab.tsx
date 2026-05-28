import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClientPositionsTable } from '../../trading/components/ClientPositionsTable';
import { useClientData } from '../context/ClientDataContext';
import { CLIENT_PATHS } from '../../../shared/routing/paths';
import { Loader2 } from 'lucide-react';

export function PortfolioTab() {
  const {
    openPositions,
    closedPositions,
    positionsLoading,
    positionsError,
    refreshPositions,
  } = useClientData();

  if (positionsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <span className="ml-3 text-muted">Cargando portafolio...</span>
      </div>
    );
  }

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="text-emerald-500" /> Portafolio
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refreshPositions()}
            className="text-cyan-400 text-sm font-bold hover:text-cyan-300"
          >
            Actualizar
          </button>
          <Link
            to={CLIENT_PATHS.trade}
            className="text-sm bg-emerald-600 hover:bg-emerald-500 text-foreground font-bold px-3 py-1 rounded-lg"
          >
            Trading
          </Link>
        </div>
      </div>
      {positionsError && <p className="text-brand400 text-sm mb-4">{positionsError}</p>}
      <p className="text-muted text-xs mb-4 uppercase font-bold">Abiertas ({openPositions.length})</p>
      <ClientPositionsTable
        positions={openPositions}
        emptyMessage="Sin posiciones abiertas. Opera desde el terminal de trading."
      />
      {closedPositions.length > 0 && (
        <>
          <p className="text-muted text-xs mt-8 mb-4 uppercase font-bold">
            Cerradas ({closedPositions.length})
          </p>
          <ClientPositionsTable positions={closedPositions} showClosePrice emptyMessage="" />
        </>
      )}
    </div>
  );
}
