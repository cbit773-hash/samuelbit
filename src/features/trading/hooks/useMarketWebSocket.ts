import { useEffect, useRef } from 'react';
import { useTradingStore } from '../store/trading.store';
import { safeCloseWebSocket } from '../utils/ws-safe';

const RECONNECT_MS = [1000, 2000, 5000, 10000];

const BINANCE_SINGLE_STREAM = new Set(['BTCUSDT', 'ETHUSDT', 'EURUSDT']);

/**
 * WebSocket Binance para un solo símbolo.
 * En terminal preferir useMultiMarketStream; este hook es para páginas sin stream combinado.
 */
export function useMarketWebSocket() {
  const activeSymbol = useTradingStore((state) => state.activeSymbol);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeSymbol || !BINANCE_SINGLE_STREAM.has(activeSymbol)) return;

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;

      safeCloseWebSocket(wsRef.current);
      wsRef.current = null;

      const { setWsStatus, setPrice } = useTradingStore.getState();
      setWsStatus(retryRef.current > 0 ? 'reconnecting' : 'connecting');

      const streamUrl = `wss://stream.binance.com:9443/ws/${activeSymbol.toLowerCase()}@trade`;
      const ws = new WebSocket(streamUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) {
          safeCloseWebSocket(ws);
          return;
        }
        retryRef.current = 0;
        setWsStatus('live');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (data.p) {
            const price = parseFloat(data.p);
            if (Number.isFinite(price)) {
              setPrice(activeSymbol, price);
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
    };
  }, [activeSymbol]);
}
