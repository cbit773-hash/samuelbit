import { useEffect, useRef, useState, useCallback } from 'react';
import { useTradingStore, type ChartOhlc } from '../store/trading.store';
import { useBinanceKlines } from './useBinanceKlines';
import {
  bucketTime,
  intervalToSeconds,
  mergeTickIntoCandle,
  createCandleFromTick,
} from '../utils/chart-time';

const TICK_THROTTLE_MS = 150;

/**
 * Velas REST de Binance + fusión de ticks WS en la vela del bucket actual.
 */
export function useTradingChartData() {
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const chartInterval = useTradingStore((s) => s.chartInterval);
  const currentPrice = useTradingStore((s) => s.currentPrice);

  const { candles: restCandles, loading, error } = useBinanceKlines(activeSymbol, chartInterval);
  const [candles, setCandles] = useState<ChartOhlc[]>([]);
  const lastTickRef = useRef(0);
  const lastCandleRef = useRef<ChartOhlc | null>(null);

  useEffect(() => {
    if (restCandles.length === 0) {
      setCandles([]);
      lastCandleRef.current = null;
      return;
    }
    const mapped: ChartOhlc[] = restCandles.map((c) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    setCandles(mapped);
    lastCandleRef.current = mapped[mapped.length - 1] ?? null;
  }, [restCandles, activeSymbol, chartInterval]);

  useEffect(() => {
    if (currentPrice == null || !Number.isFinite(currentPrice)) return;
    const now = Date.now();
    if (now - lastTickRef.current < TICK_THROTTLE_MS) return;
    lastTickRef.current = now;

    const intervalSec = intervalToSeconds(chartInterval);
    const tickBucket = bucketTime(Math.floor(now / 1000), intervalSec);
    const price = currentPrice;

    setCandles((prev) => {
      if (prev.length === 0) {
        const fresh = createCandleFromTick(tickBucket, price);
        lastCandleRef.current = fresh;
        return [fresh];
      }

      const last = lastCandleRef.current ?? prev[prev.length - 1];
      if (last.time === tickBucket) {
        const updated = mergeTickIntoCandle(last, price);
        lastCandleRef.current = updated;
        const next = [...prev];
        next[next.length - 1] = updated;
        return next;
      }

      if (tickBucket > last.time) {
        const newCandle = createCandleFromTick(tickBucket, price);
        lastCandleRef.current = newCandle;
        return [...prev, newCandle];
      }

      return prev;
    });
  }, [currentPrice, chartInterval]);

  const getLastCandle = useCallback(() => lastCandleRef.current, []);

  return { candles, loading, error, getLastCandle };
}
