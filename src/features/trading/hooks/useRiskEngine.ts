import { useEffect, useRef } from 'react';
import { useTradingStore } from '../store/trading.store';
import { useTradingPositions } from '../context/TradingPositionsContext';
import { shouldTriggerStopOut } from '../utils/margin-risk';
import { dbSymbolToMarket } from '../utils/symbol-map';

/** Motor de riesgo cliente: stop-out y brackets SL/TP */
export function useRiskEngine() {
  const { closePosition, closeAllOpenPositions, refresh } = useTradingPositions();
  const stopOutFired = useRef(false);

  const marginLevel = useTradingStore((s) => s.marginLevel);
  const positions = useTradingStore((s) => s.positions);
  const prices = useTradingStore((s) => s.prices);

  useEffect(() => {
    if (!shouldTriggerStopOut(marginLevel)) {
      stopOutFired.current = false;
      return;
    }
    if (stopOutFired.current) return;
    const open = positions.filter((p) => p.status === 'OPEN');
    if (open.length === 0) return;

    stopOutFired.current = true;
    void closeAllOpenPositions().then(() => refresh());
  }, [marginLevel, positions, closeAllOpenPositions, refresh]);

  useEffect(() => {
    const open = positions.filter((p) => p.status === 'OPEN');
    if (open.length === 0) return;

    for (const pos of open) {
      const marketSym = dbSymbolToMarket(pos.symbol);
      const price = prices[marketSym] ?? prices[pos.symbol] ?? null;
      if (price == null) continue;

      let hit = false;
      if (pos.type === 'BUY') {
        if (pos.stopLoss != null && price <= pos.stopLoss) hit = true;
        if (pos.takeProfit != null && price >= pos.takeProfit) hit = true;
      } else {
        if (pos.stopLoss != null && price >= pos.stopLoss) hit = true;
        if (pos.takeProfit != null && price <= pos.takeProfit) hit = true;
      }

      if (hit) {
        void closePosition(pos.id, price).then(() => refresh());
      }
    }
  }, [positions, prices, closePosition, refresh]);
}
