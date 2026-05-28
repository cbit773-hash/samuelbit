import type { StorePosition } from '../store/trading.store';
import { calcFloatingPnl } from './position-mappers';

export const DEFAULT_LEVERAGE = 100;

/** Margen requerido para una posición */
export function requiredMargin(volume: number, price: number, leverage: number = DEFAULT_LEVERAGE): number {
  if (price <= 0 || leverage <= 0) return 0;
  return (volume * price) / leverage;
}

/** Equity = balance + PnL flotante de todas las posiciones abiertas */
export function calcEquityFromPositions(
  balance: number,
  positions: StorePosition[],
  prices: Record<string, number>,
): number {
  let equity = balance;
  for (const pos of positions) {
    if (pos.status !== 'OPEN') continue;
    const price = prices[pos.symbol] ?? null;
    equity += calcFloatingPnl(pos, price);
  }
  return equity;
}

/** Suma de margen usado por posiciones abiertas */
export function calcUsedMargin(
  positions: StorePosition[],
  prices: Record<string, number>,
  leverage: number = DEFAULT_LEVERAGE,
): number {
  return positions
    .filter((p) => p.status === 'OPEN')
    .reduce((sum, p) => {
      const price = prices[p.symbol] ?? p.openPrice;
      return sum + requiredMargin(p.volume, price, leverage);
    }, 0);
}

export function calcFreeMargin(equity: number, usedMargin: number): number {
  return Math.max(0, equity - usedMargin);
}

/** Nivel de margen % (equity / usedMargin * 100) */
export function calcMarginLevel(equity: number, usedMargin: number): number {
  if (usedMargin <= 0) return 999;
  return (equity / usedMargin) * 100;
}

/** ¿Puede abrir nueva posición? */
export function canOpenPosition(
  equity: number,
  usedMargin: number,
  volume: number,
  price: number,
  leverage: number = DEFAULT_LEVERAGE,
): boolean {
  const needed = requiredMargin(volume, price, leverage);
  return calcFreeMargin(equity, usedMargin) >= needed;
}
