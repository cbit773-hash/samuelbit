import { describe, it, expect } from 'vitest';
import { shouldFillPendingOrder } from './pending-order.utils';
import type { PendingOrder } from '../../../core/supabase/services/orders.service';

const base: PendingOrder = {
  id: '1',
  client_id: 'u',
  symbol: 'BTC/USD',
  side: 'BUY',
  order_type: 'LIMIT',
  volume: 0.1,
  trigger_price: 100,
  stop_loss: null,
  take_profit: null,
  status: 'PENDING',
  created_at: new Date().toISOString(),
};

describe('shouldFillPendingOrder', () => {
  it('LIMIT BUY fills when price at or below trigger', () => {
    expect(shouldFillPendingOrder(base, 99)).toBe(true);
    expect(shouldFillPendingOrder(base, 101)).toBe(false);
  });

  it('STOP BUY fills when price at or above trigger', () => {
    const stop = { ...base, order_type: 'STOP' as const };
    expect(shouldFillPendingOrder(stop, 101)).toBe(true);
    expect(shouldFillPendingOrder(stop, 99)).toBe(false);
  });
});
