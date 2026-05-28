import { useEffect, useRef } from 'react';
import { useTradingStore } from '../store/trading.store';
import { getMyPendingOrders } from '../../../core/supabase/services/orders.service';
import { shouldFillPendingOrder } from '../utils/pending-order.utils';
import { dbSymbolToMarket } from '../utils/symbol-map';
import { openMyPosition } from '../../../core/supabase/services/positions.service';
import { supabase } from '../../../core/supabase/client';

/**
 * Evalúa órdenes LIMIT/STOP en cliente cuando el precio las toca.
 * No depende de `prices` en el effect (evita reinicios por cada tick WS).
 */
export function usePendingOrderWatcher(onFilled?: () => void) {
  const fillingRef = useRef<Set<string>>(new Set());
  const onFilledRef = useRef(onFilled);
  onFilledRef.current = onFilled;

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      const prices = useTradingStore.getState().prices;
      const orders = await getMyPendingOrders();
      if (cancelled || orders.length === 0) return;

      for (const order of orders) {
        if (fillingRef.current.has(order.id)) continue;
        const marketSym = dbSymbolToMarket(order.symbol);
        const price = prices[marketSym] ?? prices[order.symbol];
        if (price == null || !shouldFillPendingOrder(order, price)) continue;

        fillingRef.current.add(order.id);
        try {
          const opened = await openMyPosition({
            symbol: order.symbol,
            type: order.side,
            volume: Number(order.volume),
            open_price: price,
            stop_loss: order.stop_loss,
            take_profit: order.take_profit,
          });
          if (opened) {
            await supabase
              .from('pending_orders')
              .update({ status: 'FILLED' })
              .eq('id', order.id)
              .eq('client_id', order.client_id);
            onFilledRef.current?.();
          }
        } finally {
          fillingRef.current.delete(order.id);
        }
      }
    };

    const id = setInterval(tick, 1500);
    tick();

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);
}
