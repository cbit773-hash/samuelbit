/** Catálogo lite — 12 instrumentos core con feed Binance */
export type InstrumentAvailability = 'live' | 'coming_soon';

export interface TradingInstrument {
  id: string;
  label: string;
  category: 'crypto' | 'forex' | 'indices' | 'commodities';
  marketSymbol?: string;
  dbSymbol?: string;
  availability: InstrumentAvailability;
  spreadHint?: string;
}

export const TRADING_INSTRUMENTS: TradingInstrument[] = [
  { id: 'btc', label: 'BTC/USD', category: 'crypto', marketSymbol: 'BTCUSDT', dbSymbol: 'BTC/USD', availability: 'live', spreadHint: '$1.50' },
  { id: 'eth', label: 'ETH/USD', category: 'crypto', marketSymbol: 'ETHUSDT', dbSymbol: 'ETH/USD', availability: 'live', spreadHint: '$0.30' },
  { id: 'bnb', label: 'BNB/USD', category: 'crypto', marketSymbol: 'BNBUSDT', dbSymbol: 'BNB/USD', availability: 'live', spreadHint: '$0.20' },
  { id: 'sol', label: 'SOL/USD', category: 'crypto', marketSymbol: 'SOLUSDT', dbSymbol: 'SOL/USD', availability: 'live', spreadHint: '$0.05' },
  { id: 'xrp', label: 'XRP/USD', category: 'crypto', marketSymbol: 'XRPUSDT', dbSymbol: 'XRP/USD', availability: 'live', spreadHint: '$0.01' },
  { id: 'doge', label: 'DOGE/USD', category: 'crypto', marketSymbol: 'DOGEUSDT', dbSymbol: 'DOGE/USD', availability: 'live', spreadHint: '$0.01' },
  { id: 'ada', label: 'ADA/USD', category: 'crypto', marketSymbol: 'ADAUSDT', dbSymbol: 'ADA/USD', availability: 'live', spreadHint: '$0.01' },
  { id: 'link', label: 'LINK/USD', category: 'crypto', marketSymbol: 'LINKUSDT', dbSymbol: 'LINK/USD', availability: 'live', spreadHint: '$0.02' },
  { id: 'ltc', label: 'LTC/USD', category: 'crypto', marketSymbol: 'LTCUSDT', dbSymbol: 'LTC/USD', availability: 'live', spreadHint: '$0.05' },
  { id: 'avax', label: 'AVAX/USD', category: 'crypto', marketSymbol: 'AVAXUSDT', dbSymbol: 'AVAX/USD', availability: 'live', spreadHint: '$0.03' },
  { id: 'eur', label: 'EUR/USD', category: 'forex', marketSymbol: 'EURUSDT', dbSymbol: 'EUR/USD', availability: 'live', spreadHint: '0.1 pips' },
  { id: 'xau', label: 'Oro (PAXG)', category: 'commodities', marketSymbol: 'PAXGUSDT', dbSymbol: 'XAU/USD', availability: 'live', spreadHint: '12 pts' },
];

export const LIVE_MARKET_SYMBOLS = TRADING_INSTRUMENTS.filter((i) => i.marketSymbol).map(
  (i) => i.marketSymbol!,
);

export function getInstrumentByMarketSymbol(symbol: string): TradingInstrument | undefined {
  return TRADING_INSTRUMENTS.find((i) => i.marketSymbol === symbol);
}
