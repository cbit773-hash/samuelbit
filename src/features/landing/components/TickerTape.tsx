import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TickerData {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

const DEFAULT_TICKERS: TickerData[] = [
  { symbol: 'BTC/USDT', price: '---', change: '---', isUp: true },
  { symbol: 'ETH/USDT', price: '---', change: '---', isUp: true },
  { symbol: 'BNB/USDT', price: '---', change: '---', isUp: true },
  { symbol: 'SOL/USDT', price: '---', change: '---', isUp: true },
  { symbol: 'XRP/USDT', price: '---', change: '---', isUp: true },
  { symbol: 'ADA/USDT', price: '---', change: '---', isUp: true },
];

export function TickerTape() {
  const [prices, setPrices] = useState<TickerData[]>(DEFAULT_TICKERS);

  useEffect(() => {
    // Usar el stream de Binance combinado para obtener solo los pares relevantes y reducir ancho de banda
    const wsUrl = 'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/bnbusdt@ticker/solusdt@ticker/xrpusdt@ticker/adausdt@ticker';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const item = payload.data;
        if (!item || !item.s) return;
        
        setPrices((prev) => {
          const newPrices = [...prev];
          const index = newPrices.findIndex(p => p.symbol.replace('/', '') === item.s);
          if (index !== -1) {
            const price = parseFloat(item.c);
            const change = parseFloat(item.P);
            
            newPrices[index] = {
              ...newPrices[index],
              price: price < 10 ? price.toFixed(4) : price.toFixed(2),
              change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
              isUp: change >= 0
            };
          }
          return newPrices;
        });
      } catch (err) {
        // Ignorar errores de parseo silenciosamente
      }
    };

    return () => {
      // Prevenir el error de consola en StrictMode de React: 
      // "WebSocket is closed before the connection is established"
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', () => ws.close());
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] border-y border-white/5 overflow-hidden py-3">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...prices, ...prices, ...prices].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3 px-8 border-r border-white/10 last:border-0">
            <span className="font-bold text-gray-200">{item.symbol}</span>
            <span className="font-mono text-gray-400">{item.price}</span>
            <span className={`flex items-center text-sm font-semibold ${item.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {item.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
