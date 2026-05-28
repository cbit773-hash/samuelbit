import type { PendingOrder } from '../../../core/supabase/services/orders.service';

/** ¿Se cumple la condición de ejecución para una orden pendiente? */
export function shouldFillPendingOrder(order: PendingOrder, marketPrice: number): boolean {
  const trigger = Number(order.trigger_price);
  if (!Number.isFinite(trigger) || !Number.isFinite(marketPrice)) return false;

  if (order.order_type === 'LIMIT') {
    return order.side === 'BUY' ? marketPrice <= trigger : marketPrice >= trigger;
  }
  // STOP
  return order.side === 'BUY' ? marketPrice >= trigger : marketPrice <= trigger;
}
