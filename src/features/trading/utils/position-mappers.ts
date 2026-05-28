import type { Position as DbPosition } from '../../../core/supabase/database.types';
import type { StorePosition } from '../store/trading.store';
import { dbSymbolToMarket } from './symbol-map';

export function dbToStorePosition(p: DbPosition): StorePosition {
  return {
    id: p.id,
    symbol: dbSymbolToMarket(p.symbol),
    type: p.type,
    volume: Number(p.volume),
    openPrice: Number(p.open_price),
    closePrice: p.close_price != null ? Number(p.close_price) : null,
    pnl: p.pnl != null ? Number(p.pnl) : null,
    status: p.status,
    stopLoss: p.stop_loss != null ? Number(p.stop_loss) : null,
    takeProfit: p.take_profit != null ? Number(p.take_profit) : null,
    openedAt: p.opened_at,
    closedAt: p.closed_at,
  };
}

export function calcFloatingPnl(
  pos: StorePosition,
  currentPrice: number | null
): number {
  if (!currentPrice || pos.status === 'CLOSED') {
    return pos.pnl ?? 0;
  }
  const diff = currentPrice - pos.openPrice;
  return pos.type === 'BUY' ? diff * pos.volume : -diff * pos.volume;
}
