import { describe, it, expect } from 'vitest';
import {
  bucketTime,
  intervalToSeconds,
  mergeTickIntoCandle,
  createCandleFromTick,
} from './chart-time';

describe('chart-time', () => {
  it('intervalToSeconds', () => {
    expect(intervalToSeconds('15m')).toBe(900);
    expect(intervalToSeconds('1h')).toBe(3600);
    expect(intervalToSeconds('1d')).toBe(86400);
  });

  it('bucketTime aligns to 15m boundary', () => {
    const t = 1_700_000_123;
    const bucket = bucketTime(t, 900);
    expect(bucket % 900).toBe(0);
    expect(bucket).toBeLessThanOrEqual(t);
    expect(t - bucket).toBeLessThan(900);
  });

  it('bucketTime aligns to 1h boundary', () => {
    const t = 1_700_003_999;
    const bucket = bucketTime(t, 3600);
    expect(bucket % 3600).toBe(0);
  });

  it('mergeTickIntoCandle updates OHLC', () => {
    const base = createCandleFromTick(1000, 100);
    const merged = mergeTickIntoCandle(base, 105);
    expect(merged.close).toBe(105);
    expect(merged.high).toBe(105);
    expect(merged.low).toBe(100);
  });
});
