/** Mapeo entre s├¡mbolo del WebSocket (Binance) y s├¡mbolo en BD */
import { LIVE_MARKET_SYMBOLS } from '../config/instruments';

const TO_DB: Record<string, string> = {
  BTCUSDT: 'BTC/USD',
  ETHUSDT: 'ETH/USD',
  EURUSDT: 'EUR/USD',
};

const TO_MARKET: Record<string, string> = {
  'BTC/USD': 'BTCUSDT',
  'ETH/USD': 'ETHUSDT',
  'EUR/USD': 'EURUSDT',
};

export function marketSymbolToDb(symbol: string): string {
  return TO_DB[symbol] ?? symbol;
}

export function dbSymbolToMarket(symbol: string): string {
  return TO_MARKET[symbol] ?? symbol;
}

/** Pares con stream @trade verificado en Binance (XAUUSDT no existe en spot) */
const BINANCE_STREAM_SYMBOLS = new Set(['BTCUSDT', 'ETHUSDT', 'EURUSDT']);

export function isBinanceStreamSymbol(symbol: string): boolean {
  return BINANCE_STREAM_SYMBOLS.has(symbol);
}

/** S├¡mbolos Binance suscritos en el stream combinado */
export function getTradableMarketSymbols(): string[] {
  return LIVE_MARKET_SYMBOLS.filter((s) => BINANCE_STREAM_SYMBOLS.has(s));
}
