import { useEffect, useState } from 'react';
import { useTradingStore } from '../store/trading.store';

interface OrderLevel {
  price: string;
  amount: string;
  total: string;
}

export function OrderBook() {
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const [asks, setAsks] = useState<OrderLevel[]>([]);
  const [bids, setBids] = useState<OrderLevel[]>([]);

  // Simulación dinámica del Order Book basada en el precio actual
  useEffect(() => {
    if (!currentPrice) return;

    const generateLevels = (basePrice: number, isAsk: boolean) => {
      const levels: OrderLevel[] = [];
      let currentTotal = 0;
      for (let i = 0; i < 15; i++) {
        // Los asks suben de precio, los bids bajan
        const step = (Math.random() * 2 + 0.5) * (isAsk ? 1 : -1);
        const price = basePrice + step + (isAsk ? i * 2 : -i * 2);
        const amount = Math.random() * 2;
        currentTotal += amount;
        
        levels.push({
          price: price.toFixed(2),
          amount: amount.toFixed(4),
          total: currentTotal.toFixed(4),
        });
      }
      return isAsk ? levels.reverse() : levels; // Asks se muestran de mayor a menor arriba
    };

    const interval = setInterval(() => {
      setAsks(generateLevels(currentPrice, true));
      setBids(generateLevels(currentPrice, false));
    }, 1000); // Actualiza cada segundo para simular profundidad

    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="bg-surface-alt border border-border rounded-2xl flex flex-col h-full shadow-xl">
      <div className="p-4 border-b border-border">
        <h3 className="text-foreground font-bold text-sm">Libro de Órdenes</h3>
      </div>
      
      <div className="flex text-xs text-muted font-semibold px-4 py-2 border-b border-border">
        <div className="flex-1">Precio (USDT)</div>
        <div className="flex-1 text-right">Cantidad (BTC)</div>
        <div className="flex-1 text-right">Total</div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-2 text-xs font-mono">
        {/* Asks (Vendedores - Rojo) */}
        <div className="flex-1 flex flex-col justify-end space-y-[2px]">
          {asks.map((ask, i) => (
            <div key={`ask-${i}`} className="flex hover:bg-surface-inset cursor-pointer relative group">
              <div className="absolute right-0 top-0 bottom-0 bg-rose-500/10 z-0 transition-all" style={{ width: `${Math.random() * 100}%` }}></div>
              <div className="flex-1 text-rose-500 relative z-10 pl-2">{ask.price}</div>
              <div className="flex-1 text-right text-foreground relative z-10">{ask.amount}</div>
              <div className="flex-1 text-right text-muted relative z-10 pr-2">{ask.total}</div>
            </div>
          ))}
        </div>

        {/* Current Price spread */}
        <div className="py-2 text-center text-lg font-bold text-foreground border-y border-border my-1 bg-background">
          {currentPrice ? currentPrice.toFixed(2) : '---'}
          <span className="text-xs text-muted ml-2 font-sans font-normal">Spread: 0.1</span>
        </div>

        {/* Bids (Compradores - Verde) */}
        <div className="flex-1 flex flex-col space-y-[2px]">
          {bids.map((bid, i) => (
            <div key={`bid-${i}`} className="flex hover:bg-surface-inset cursor-pointer relative group">
              <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 z-0 transition-all" style={{ width: `${Math.random() * 100}%` }}></div>
              <div className="flex-1 text-emerald-500 relative z-10 pl-2">{bid.price}</div>
              <div className="flex-1 text-right text-foreground relative z-10">{bid.amount}</div>
              <div className="flex-1 text-right text-muted relative z-10 pr-2">{bid.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
