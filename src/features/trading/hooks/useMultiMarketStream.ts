import { useEffect, useRef } from 'react';
import { useTradingStore } from '../store/trading.store';
import { getTradableMarketSymbols } from '../utils/symbol-map';
import { safeCloseWebSocket } from '../utils/ws-safe';

const RECONNECT_MS = [1000, 2000, 5000, 10000];

/**
 * Binance combined trade stream — una conexión para la watchlist.
 * Tolerante a React Strict Mode (doble mount en dev).
 */
export function useMultiMarketStream() {
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const symbols = getTradableMarketSymbols();
    if (symbols.length === 0) return;

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;

      safeCloseWebSocket(wsRef.current);
      wsRef.current = null;

      const { setWsStatus } = useTradingStore.getState();
      setWsStatus(retryRef.current > 0 ? 'reconnecting' : 'connecting');

      const streams = symbols.map((s) => `${s.toLowerCase()}@trade`).join('/');
      const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) {
          safeCloseWebSocket(ws);
          return;
        }
        retryRef.current = 0;
        useTradingStore.getState().setWsStatus('live');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          const data = msg.data ?? msg;
          if (data?.s && data?.p) {
            const sym = String(data.s).toUpperCase();
            const price = parseFloat(data.p);
            if (Number.isFinite(price)) {
              useTradingStore.getState().setPrice(sym, price);
            }
          }
        } catch {
          /* ignore */
        }
      };

      ws.onerror = () => {
        if (!cancelled) useTradingStore.getState().setWsStatus('offline');
      };

      ws.onclose = () => {
        if (cancelled) return;
        wsRef.current = null;
        useTradingStore.getState().setWsStatus('offline');
        const delay = RECONNECT_MS[Math.min(retryRef.current, RECONNECT_MS.length - 1)];
        retryRef.current += 1;
        timerRef.current = setTimeout(connect, delay);
      };
    };

    connectDelayRef.current = setTimeout(connect, 0);

    return () => {
      cancelled = true;
      if (connectDelayRef.current) clearTimeout(connectDelayRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      safeCloseWebSocket(wsRef.current);
      wsRef.current = null;
      useTradingStore.getState().setWsStatus('offline');
    };
  }, []);
}
