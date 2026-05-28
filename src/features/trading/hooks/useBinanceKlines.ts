import { useEffect, useState } from 'react';
import type { ChartInterval } from '../store/trading.store';
import type { IndicatorCandle } from '../utils/indicators';
import { isBinanceStreamSymbol } from '../utils/symbol-map';

const INTERVAL_MAP: Record<ChartInterval, string> = {
  '15m': '15m',
  '1h': '1h',
  '1d': '1d',
};

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

    const binanceInterval = INTERVAL_MAP[interval];
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${binanceInterval}&limit=120`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('No se pudieron cargar velas');
        return r.json();
      })
      .then((rows: (string | number)[][]) => {
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
