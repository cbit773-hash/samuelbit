import type { ChartInterval, ChartOhlc } from '../store/trading.store';

const INTERVAL_SECONDS: Record<ChartInterval, number> = {
  '15m': 15 * 60,
  '1h': 60 * 60,
  '1d': 24 * 60 * 60,
};

export function intervalToSeconds(interval: ChartInterval): number {
  return INTERVAL_SECONDS[interval];
}

/** Inicio de vela UTC (segundos), alineado a Binance */
export function bucketTime(unixSec: number, intervalSec: number): number {
  return Math.floor(unixSec / intervalSec) * intervalSec;
}

export function mergeTickIntoCandle(candle: ChartOhlc, price: number): ChartOhlc {
  return {
    time: candle.time,
    open: candle.open,
    high: Math.max(candle.high, price),
    low: Math.min(candle.low, price),
    close: price,
  };
}

export function createCandleFromTick(time: number, price: number): ChartOhlc {
  return { time, open: price, high: price, low: price, close: price };
}

/** Convierte ISO opened_at a bucket de vela para markers */
export function openedAtToBucket(iso: string | undefined, interval: ChartInterval): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  return bucketTime(Math.floor(ms / 1000), intervalToSeconds(interval));
}
