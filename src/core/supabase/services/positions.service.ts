// ============================================================
// INVESPRO ÔÇö Servicio de Posiciones de Trading (Supabase)
// ============================================================
import { supabase } from '../client';
import type { Position, PositionInsert } from '../database.types';
import { isDemoUserId } from '../demo-ids';

export type TradingAccountMode = 'demo' | 'live';

export async function getCurrentClientId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || isDemoUserId(user.id)) return null;
  return user.id;
}

async function getMyAccountMode(): Promise<TradingAccountMode> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'demo';
  const { data } = await supabase.from('wallets').select('account_mode').eq('client_id', user.id).maybeSingle();
  const mode = data?.account_mode;
  return mode === 'live' ? 'live' : 'demo';
}

/** Obtener posiciones del cliente autenticado */
export async function getMyPositions(accountMode?: TradingAccountMode): Promise<Position[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const mode = accountMode ?? (await getMyAccountMode());

  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('client_id', user.id)
    .eq('account_mode', mode)
    .order('opened_at', { ascending: false });

  if (error) { console.error('[Positions] Error fetching positions:', error); return []; }
  return (data || []) as Position[];
}

/** Obtener posiciones abiertas del cliente autenticado */
export async function getMyOpenPositions(accountMode?: TradingAccountMode): Promise<Position[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const mode = accountMode ?? (await getMyAccountMode());

  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('client_id', user.id)
    .eq('account_mode', mode)
    .eq('status', 'OPEN')
    .order('opened_at', { ascending: false });

  if (error) { console.error('[Positions] Error fetching open positions:', error); return []; }
  return (data || []) as Position[];
}

/** Obtener posiciones cerradas del cliente autenticado */
export async function getMyClosedPositions(accountMode?: TradingAccountMode): Promise<Position[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const mode = accountMode ?? (await getMyAccountMode());

  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('client_id', user.id)
    .eq('account_mode', mode)
    .eq('status', 'CLOSED')
    .order('closed_at', { ascending: false });

  if (error) { console.error('[Positions] Error fetching closed positions:', error); return []; }
  return (data || []) as Position[];
}

/** Abrir posici├│n v├¡a RPC con validaci├│n de margen */
export async function openMyPosition(
  position: Omit<PositionInsert, 'client_id'> & {
    stop_loss?: number | null;
    take_profit?: number | null;
  },
): Promise<Position | null> {
  const clientId = await getCurrentClientId();
  if (!clientId) return null;

  const { data, error } = await supabase.rpc('open_position_with_risk', {
    p_symbol: position.symbol,
    p_type: position.type,
    p_volume: position.volume,
    p_open_price: position.open_price,
    p_stop_loss: position.stop_loss ?? null,
    p_take_profit: position.take_profit ?? null,
  });

  if (error) {
    console.error('[Positions] open_position_with_risk:', error);
    throw new Error(error.message);
  }

  const payload = data as { position_id?: string; ok?: boolean };
  if (!payload?.position_id) return null;

  const { data: row, error: selError } = await supabase
    .from('positions')
    .select('*')
    .eq('id', payload.position_id)
    .single();

  if (selError) return null;
  return row as Position;
}

/** @deprecated Use openMyPosition */
export async function openPosition(position: PositionInsert): Promise<Position | null> {
  return openMyPosition(position);
}

/** Cerrar posici├│n y liquidar PnL en el book correcto */
export async function closePosition(id: string, closePrice: number, pnl: number): Promise<Position | null> {
  const { error } = await supabase.rpc('close_position_settle', {
    p_position_id: id,
    p_close_price: closePrice,
    p_pnl: pnl,
  });

  if (error) {
    console.error('[Positions] close_position_settle:', error);
    return null;
  }

  const { data: row, error: selError } = await supabase
    .from('positions')
    .select('*')
    .eq('id', id)
    .single();

  if (selError) return null;
  return row as Position;
}

/** KPIs de cuenta del cliente (filtrado por modo) */
export async function getClientAccountKPIs(
  clientId?: string,
  accountMode?: TradingAccountMode,
): Promise<{
  openPositions: number;
  totalPnl: number;
  floatingPnl: number;
}> {
  let mode = accountMode;
  let uid = clientId;

  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { openPositions: 0, totalPnl: 0, floatingPnl: 0 };
    uid = user.id;
  }
  if (!mode) mode = await getMyAccountMode();

  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('client_id', uid)
    .eq('account_mode', mode);

  if (error || !data) return { openPositions: 0, totalPnl: 0, floatingPnl: 0 };

  const positions = data as Position[];
  return {
    openPositions: positions.filter((p) => p.status === 'OPEN').length,
    totalPnl: positions.filter((p) => p.status === 'CLOSED').reduce((sum, p) => sum + (Number(p.pnl) || 0), 0),
    floatingPnl: positions.filter((p) => p.status === 'OPEN').reduce((sum, p) => sum + (Number(p.pnl) || 0), 0),
  };
}
