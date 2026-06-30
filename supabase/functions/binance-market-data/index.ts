import { handleCors, jsonResponse } from '../_shared/cors.ts';

const BINANCE_BASE = 'https://api.binance.com';

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(req.url);
  const symbol = url.searchParams.get('symbol');
  const interval = url.searchParams.get('interval') ?? '1h';
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '200'), 500);

  if (!symbol || !/^[A-Z0-9]+$/.test(symbol)) {
    return jsonResponse({ error: 'Invalid symbol' }, 400);
  }

  const allowed = ['1m', '5m', '15m', '1h', '4h', '1d'];
  if (!allowed.includes(interval)) {
    return jsonResponse({ error: 'Invalid interval' }, 400);
  }

  try {
    const binanceUrl = `${BINANCE_BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const res = await fetch(binanceUrl);
    if (!res.ok) {
      return jsonResponse({ error: 'Binance API error' }, res.status);
    }
    const data = await res.json();
    return jsonResponse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Proxy error';
    return jsonResponse({ error: msg }, 500);
  }
});
