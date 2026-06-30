import { describe, it, expect } from 'vitest';
import { getOrderBlockReason } from './order-guards';

const base = {
  wsStatus: 'live' as const,
  equity: 10000,
  usedMargin: 0,
  marginLevel: 999,
  volume: 0.1,
  price: 50000,
  leverage: 100,
};

describe('getOrderBlockReason', () => {
  it('blocks when websocket is not live', () => {
    expect(
      getOrderBlockReason({ ...base, wsStatus: 'connecting', accountMode: 'demo', activeBalance: 10000 })
    ).toMatch(/cotización en vivo/i);
  });

  it('allows demo with virtual balance and margin', () => {
    expect(
      getOrderBlockReason({ ...base, accountMode: 'demo', activeBalance: 10000 })
    ).toBeNull();
  });

  it('blocks live when balance is zero', () => {
    expect(
      getOrderBlockReason({ ...base, accountMode: 'live', activeBalance: 0 })
    ).toMatch(/Deposita fondos/i);
  });

  it('blocks when margin is insufficient', () => {
    expect(
      getOrderBlockReason({
        ...base,
        accountMode: 'demo',
        activeBalance: 100,
        equity: 100,
        usedMargin: 95,
        volume: 1,
      })
    ).toMatch(/Margen insuficiente/i);
  });

  it('blocks on margin call', () => {
    expect(
      getOrderBlockReason({
        ...base,
        accountMode: 'demo',
        activeBalance: 10000,
        marginLevel: 80,
      }),
    ).toMatch(/Margin call/i);
  });
});
