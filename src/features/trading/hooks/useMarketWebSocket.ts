import { useEffect, useRef } from 'react';
import { useTradingStore } from '../store/trading.store';

/**
 * Hook para conectar con Binance WebSockets en tiempo real.
 * Provee datos de precios sin latencia directamente a Zustand.
 */
export function useMarketWebSocket() {
  const activeSymbol = useTradingStore((state) => state.activeSymbol);
  const setCurrentPrice = useTradingStore((state) => state.setCurrentPrice);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!activeSymbol) return;

    // Connect to Binance public stream for real-time trade prices
    const streamUrl = `wss://stream.binance.com:9443/ws/${activeSymbol.toLowerCase()}@trade`;
    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.p) {
        // data.p es el precio en formato string
        setCurrentPrice(parseFloat(data.p));
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [activeSymbol, setCurrentPrice]);
}
