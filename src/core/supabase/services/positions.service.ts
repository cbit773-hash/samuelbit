// ============================================================
// INVESPRO — Servicio de Posiciones de Trading (Supabase)
// ============================================================
import { supabase } from '../client';
import type { Position, PositionInsert } from '../database.types';

/** Obtener posiciones del cliente autenticado */
export async function getMyPositions(): Promise<Position[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('client_id', user.id)
    .order('opened_at', { ascending: false });

  if (error) { console.error('[Positions] Error fetching positions:', error); return []; }
  return (data || []) as Position[];
}

/** Obtener posiciones abiertas del cliente autenticado */
export async function getMyOpenPositions(): Promise<Position[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('client_id', user.id)
    .eq('status', 'OPEN')
    .order('opened_at', { ascending: false });

  if (error) { console.error('[Positions] Error fetching open positions:', error); return []; }
  return (data || []) as Position[];
}

/** Obtener posiciones cerradas del cliente autenticado */
export async function getMyClosedPositions(): Promise<Position[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('client_id', user.id)
    .eq('status', 'CLOSED')
    .order('closed_at', { ascending: false });

  if (error) { console.error('[Positions] Error fetching closed positions:', error); return []; }
  return (data || []) as Position[];
}

/** Abrir una nueva posición */
export async function openPosition(position: PositionInsert): Promise<Position | null> {
  const { data, error } = await supabase
    .from('positions')
    .insert({ ...position, status: 'OPEN' })
    .select()
    .single();

  if (error) { console.error('[Positions] Error opening position:', error); return null; }
  return data as Position;
}

/** Cerrar una posición */
export async function closePosition(id: string, closePrice: number, pnl: number): Promise<Position | null> {
  const { data, error } = await supabase
    .from('positions')
    .update({
      close_price: closePrice,
      pnl,
      status: 'CLOSED',
      closed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) { console.error('[Positions] Error closing position:', error); return null; }
  return data as Position;
}

/** KPIs de cuenta del cliente */
export async function getClientAccountKPIs(clientId?: string): Promise<{
  openPositions: number;
  totalPnl: number;
  floatingPnl: number;
}> {
  let query = supabase.from('positions').select('*');
  
  if (clientId) {
    query = query.eq('client_id', clientId);
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { openPositions: 0, totalPnl: 0, floatingPnl: 0 };
    query = query.eq('client_id', user.id);
  }

  const { data, error } = await query;
  if (error || !data) return { openPositions: 0, totalPnl: 0, floatingPnl: 0 };

  const positions = data as Position[];
  return {
    openPositions: positions.filter(p => p.status === 'OPEN').length,
    totalPnl: positions.filter(p => p.status === 'CLOSED').reduce((sum, p) => sum + (Number(p.pnl) || 0), 0),
    floatingPnl: positions.filter(p => p.status === 'OPEN').reduce((sum, p) => sum + (Number(p.pnl) || 0), 0),
  };
}
