import { useEffect, useState } from 'react';
import type { ChartInterval } from '../store/trading.store';
import type { IndicatorCandle } from '../utils/indicators';
import { isBinanceStreamSymbol } from '../utils/symbol-map';
import { fetchBinanceKlines } from '../utils/fetch-binance-rest';

export function useBinanceKlines(symbol: string, interval: ChartInterval) {
  const [candles, setCandles] = useState<IndicatorCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    if (!isBinanceStreamSymbol(symbol)) {
      setCandles([]);
      setError('Este instrumento aún no tiene feed en vivo en Binance.');
      setLoading(false);
      return;
    }

    fetchBinanceKlines(symbol, interval, 120)
      .then((rows) => {
        if (cancelled) return;
        const parsed: IndicatorCandle[] = rows.map((k) => ({
          time: Math.floor(Number(k[0]) / 1000),
          open: parseFloat(String(k[1])),
          high: parseFloat(String(k[2])),
          low: parseFloat(String(k[3])),
          close: parseFloat(String(k[4])),
        }));
        setCandles(parsed);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error de velas');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol, interval]);

  return { candles, loading, error };
}
