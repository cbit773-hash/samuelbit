import { describe, it, expect } from 'vitest';
import { pickPositionsForChart, getSelectedPosition } from './chart-overlay-policy';
import type { StorePosition } from '../store/trading.store';

function pos(id: string, openedAt: string): StorePosition {
  return {
    id,
    symbol: 'BTCUSDT',
    type: 'BUY',
    volume: 0.01,
    openPrice: 100,
    status: 'OPEN',
    openedAt,
  };
}

describe('pickPositionsForChart', () => {
  it('returns empty for no positions', () => {
    expect(pickPositionsForChart([], null)).toEqual([]);
  });

  it('returns single position', () => {
    const one = [pos('a', '2026-01-01T10:00:00Z')];
    expect(pickPositionsForChart(one, null)).toHaveLength(1);
  });

  it('caps at 2 most recent when no selection', () => {
    const many = [
      pos('old', '2026-01-01T08:00:00Z'),
      pos('mid', '2026-01-01T09:00:00Z'),
      pos('new', '2026-01-01T10:00:00Z'),
    ];
    const picked = pickPositionsForChart(many, null, 2);
    expect(picked).toHaveLength(2);
    expect(picked.map((p) => p.id)).toEqual(['new', 'mid']);
  });

  it('includes selected plus one recent', () => {
    const many = [
      pos('old', '2026-01-01T08:00:00Z'),
      pos('mid', '2026-01-01T09:00:00Z'),
      pos('new', '2026-01-01T10:00:00Z'),
    ];
    const picked = pickPositionsForChart(many, 'old', 2);
    expect(picked).toHaveLength(2);
    expect(picked.map((p) => p.id)).toContain('old');
    expect(picked.map((p) => p.id)).toContain('new');
  });
});

describe('getSelectedPosition', () => {
  it('finds by id', () => {
    const list = [pos('x', '2026-01-01T10:00:00Z')];
    expect(getSelectedPosition(list, 'x')?.id).toBe('x');
  });
});
