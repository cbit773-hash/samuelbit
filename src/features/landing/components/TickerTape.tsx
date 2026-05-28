import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { darkUi } from '../../../shared/theme/dark-ui';

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
    const wsUrl =
      'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/bnbusdt@ticker/solusdt@ticker/xrpusdt@ticker/adausdt@ticker';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const item = payload.data;
        if (!item?.s) return;

        setPrices((prev) => {
          const newPrices = [...prev];
          const index = newPrices.findIndex((p) => p.symbol.replace('/', '') === item.s);
          if (index !== -1) {
            const price = parseFloat(item.c);
            const change = parseFloat(item.P);
            newPrices[index] = {
              ...newPrices[index],
              price: price < 10 ? price.toFixed(4) : price.toFixed(2),
              change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
              isUp: change >= 0,
            };
          }
          return newPrices;
        });
      } catch {
        /* ignore */
      }
    };

    return () => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', () => ws.close());
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className={`w-full ${darkUi.bgInset} border-y ${darkUi.border} overflow-hidden py-3`}>
      <div className="flex whitespace-nowrap animate-marquee">
        {[...prices, ...prices, ...prices].map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center space-x-3 px-8 border-r ${darkUi.border} last:border-0`}
          >
            <span className={`font-bold ${darkUi.textPrimary}`}>{item.symbol}</span>
            <span className={`font-mono ${darkUi.textSecondary}`}>{item.price}</span>
            <span
              className={`flex items-center text-sm font-semibold ${
                item.isUp ? 'text-[#9fe870]' : 'text-[#ef4444]'
              }`}
            >
              {item.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
