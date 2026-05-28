import { describe, it, expect } from 'vitest';
import {
  requiredMargin,
  calcEquityFromPositions,
  calcFreeMargin,
  canOpenPosition,
} from './margin.calculator';
import type { StorePosition } from '../store/trading.store';

describe('margin.calculator', () => {
  it('requiredMargin divides by leverage', () => {
    expect(requiredMargin(1, 50000, 100)).toBe(500);
  });

  it('calcEquity includes floating pnl', () => {
    const positions: StorePosition[] = [
      {
        id: '1',
        symbol: 'BTCUSDT',
        type: 'BUY',
        volume: 0.1,
        openPrice: 50000,
        status: 'OPEN',
      },
    ];
    const equity = calcEquityFromPositions(10000, positions, { BTCUSDT: 51000 });
    expect(equity).toBeGreaterThan(10000);
  });

  it('canOpenPosition fails when free margin low', () => {
    const ok = canOpenPosition(100, 95, 1, 50000, 100);
    expect(ok).toBe(false);
  });

  it('calcFreeMargin never negative', () => {
    expect(calcFreeMargin(50, 100)).toBe(0);
  });
});
