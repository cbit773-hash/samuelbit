/** Catálogo de instrumentos — alineado a disponibilidad en terminal (Binance WS) */
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
  { id: 'eur', label: 'EUR/USD', category: 'forex', marketSymbol: 'EURUSDT', dbSymbol: 'EUR/USD', availability: 'live', spreadHint: '0.1 pips' },
  { id: 'xau', label: 'Oro XAU/USD', category: 'commodities', marketSymbol: 'XAUUSDT', dbSymbol: 'XAU/USD', availability: 'live', spreadHint: '12 pts' },
  { id: 'sp500', label: 'S&P 500 (CFD índice)', category: 'indices', availability: 'coming_soon', spreadHint: 'Solicitar al asesor' },
  { id: 'nasdaq', label: 'Nasdaq 100 (CFD índice)', category: 'indices', availability: 'coming_soon', spreadHint: 'Solicitar al asesor' },
  { id: 'usdpend', label: 'USD/PEN', category: 'forex', availability: 'coming_soon', spreadHint: 'Próximamente' },
];

export const LIVE_MARKET_SYMBOLS = TRADING_INSTRUMENTS.filter((i) => i.marketSymbol).map(
  (i) => i.marketSymbol!,
);

export function getInstrumentByMarketSymbol(symbol: string): TradingInstrument | undefined {
  return TRADING_INSTRUMENTS.find((i) => i.marketSymbol === symbol);
}
