/** Mapeo entre símbolo del WebSocket (Binance) y símbolo en BD */
import { LIVE_MARKET_SYMBOLS, TRADING_INSTRUMENTS } from '../config/instruments';

const TO_DB: Record<string, string> = Object.fromEntries(
  TRADING_INSTRUMENTS.filter((i) => i.marketSymbol && i.dbSymbol).map((i) => [
    i.marketSymbol!,
    i.dbSymbol!,
  ]),
);

const TO_MARKET: Record<string, string> = Object.fromEntries(
  TRADING_INSTRUMENTS.filter((i) => i.marketSymbol && i.dbSymbol).map((i) => [
    i.dbSymbol!,
    i.marketSymbol!,
  ]),
);

export function marketSymbolToDb(symbol: string): string {
  return TO_DB[symbol] ?? symbol;
}

export function dbSymbolToMarket(symbol: string): string {
  return TO_MARKET[symbol] ?? symbol;
}

const BINANCE_STREAM_SYMBOLS = new Set(LIVE_MARKET_SYMBOLS);

export function isBinanceStreamSymbol(symbol: string): boolean {
  return BINANCE_STREAM_SYMBOLS.has(symbol);
}

export function getTradableMarketSymbols(): string[] {
  return LIVE_MARKET_SYMBOLS.filter((s) => BINANCE_STREAM_SYMBOLS.has(s));
}
