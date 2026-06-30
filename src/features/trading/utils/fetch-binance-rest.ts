const INTERVAL_MAP: Record<string, string> = {
  '15m': '15m',
  '1h': '1h',
  '1d': '1d',
};

/** Fetch klines — Edge en prod, Binance directo en dev */
export async function fetchBinanceKlines(
  symbol: string,
  interval: string,
  limit = 200,
): Promise<(string | number)[][]> {
  const isDev = import.meta.env.DEV;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const binanceInterval = INTERVAL_MAP[interval] ?? interval;

  if (!isDev && supabaseUrl) {
    const fnUrl = `${supabaseUrl}/functions/v1/binance-market-data?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(binanceInterval)}&limit=${limit}`;
    const res = await fetch(fnUrl, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    });
    if (res.ok) {
      return (await res.json()) as (string | number)[][];
    }
  }

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${binanceInterval}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudieron cargar velas');
  return (await res.json()) as (string | number)[][];
}
