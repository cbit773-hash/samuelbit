import type { AccountMode } from '../store/trading.store';
import type { WsConnectionStatus } from '../store/trading.store';
import { canOpenPosition, requiredMargin } from './margin.calculator';

export interface OrderGuardInput {
  wsStatus: WsConnectionStatus;
  accountMode: AccountMode;
  activeBalance: number;
  equity: number;
  usedMargin: number;
  volume: number;
  price: number | null;
  leverage: number;
}

export function getOrderBlockReason(input: OrderGuardInput): string | null {
  const { wsStatus, accountMode, activeBalance, equity, usedMargin, volume, price, leverage } = input;

  if (wsStatus !== 'live') {
    return 'Esperando cotización en vivo…';
  }
  if (price == null || price <= 0) {
    return 'Precio no disponible';
  }
  if (volume <= 0) {
    return 'Indica un volumen válido';
  }
  if (accountMode === 'live' && activeBalance <= 0) {
    return 'Deposita fondos para operar en cuenta real';
  }
  if (!canOpenPosition(equity, usedMargin, volume, price, leverage)) {
    const needed = requiredMargin(volume, price, leverage);
    const free = Math.max(0, equity - usedMargin);
    return `Margen insuficiente (necesitas ~$${needed.toFixed(2)}, libre $${free.toFixed(2)})`;
  }
  return null;
}
