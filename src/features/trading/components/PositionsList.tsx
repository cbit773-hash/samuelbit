import { useTradingStore } from '../store/trading.store';
import { XCircle } from 'lucide-react';

export function PositionsList() {
  const positions = useTradingStore((state) => state.positions);
  const closePosition = useTradingStore((state) => state.closePosition);
  const currentPrice = useTradingStore((state) => state.currentPrice);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col w-full overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/10 flex gap-4">
        <button className="text-white font-bold text-sm border-b-2 border-primary pb-1">Posiciones Abiertas ({positions.length})</button>
        <button className="text-gray-500 font-semibold text-sm hover:text-white pb-1">Órdenes Pendientes</button>
        <button className="text-gray-500 font-semibold text-sm hover:text-white pb-1">Historial</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 bg-black/20 uppercase border-b border-white/5">
            <tr>
              <th className="px-6 py-3">Símbolo</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Volumen</th>
              <th className="px-6 py-3">Precio Apertura</th>
              <th className="px-6 py-3">Precio Actual</th>
              <th className="px-6 py-3">Beneficio (PNL)</th>
              <th className="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No tienes posiciones abiertas actualmente.
                </td>
              </tr>
            ) : (
              positions.map((pos) => {
                // Cálculo de PNL en tiempo real
                let pnl = 0;
                if (currentPrice) {
                  const diff = currentPrice - pos.openPrice;
                  pnl = pos.type === 'BUY' ? diff * pos.volume : -diff * pos.volume;
                }
                const isProfit = pnl >= 0;

                return (
                  <tr key={pos.id} className="border-b border-white/5 hover:bg-white/5 transition-colors font-mono">
                    <td className="px-6 py-4 font-bold text-white font-sans">{pos.symbol}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${pos.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {pos.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{pos.volume}</td>
                    <td className="px-6 py-4">${pos.openPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">${currentPrice?.toFixed(2) || '---'}</td>
                    <td className={`px-6 py-4 font-bold ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isProfit ? '+' : ''}{pnl.toFixed(2)} USDT
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => closePosition(pos.id)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                        title="Cerrar Posición"
                      >
                        <XCircle size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
