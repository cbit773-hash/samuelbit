import { supabase } from '../client';
import { isDemoUserId } from '../demo-ids';

export interface PendingOrder {
  id: string;
  client_id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  order_type: 'LIMIT' | 'STOP';
  volume: number;
  trigger_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'EXPIRED';
  created_at: string;
}

export async function getMyPendingOrders(accountMode?: 'demo' | 'live'): Promise<PendingOrder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || isDemoUserId(user.id)) return [];

  let mode = accountMode;
  if (!mode) {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('account_mode')
      .eq('client_id', user.id)
      .maybeSingle();
    mode = (wallet?.account_mode as 'demo' | 'live' | null) ?? 'demo';
  }

  const { data, error } = await supabase
    .from('pending_orders')
    .select('*')
    .eq('client_id', user.id)
    .eq('status', 'PENDING')
    .eq('account_mode', mode)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Orders] pending:', error);
    return [];
  }
  return (data ?? []) as PendingOrder[];
}

export type PlacePendingOrderResult =
  | { order: PendingOrder; error?: undefined }
  | { order?: undefined; error: string };

export async function placePendingOrder(params: {
  symbol: string;
  side: 'BUY' | 'SELL';
  order_type: 'LIMIT' | 'STOP';
  volume: number;
  trigger_price: number;
  stop_loss?: number | null;
  take_profit?: number | null;
}): Promise<PlacePendingOrderResult> {
  const { data, error } = await supabase.rpc('place_pending_order', {
    p_symbol: params.symbol,
    p_side: params.side,
    p_order_type: params.order_type,
    p_volume: params.volume,
    p_trigger_price: params.trigger_price,
    p_stop_loss: params.stop_loss ?? null,
    p_take_profit: params.take_profit ?? null,
  });

  if (error) {
    console.error('[Orders] place:', error);
    return { error: error.message };
  }
  const row = data as { order_id?: string } | null;
  if (!row?.order_id) return { error: 'No se pudo crear la orden' };

  const { data: order, error: fetchErr } = await supabase
    .from('pending_orders')
    .select('*')
    .eq('id', row.order_id)
    .single();

  if (fetchErr || !order) return { error: fetchErr?.message ?? 'Orden no encontrada' };
  return { order: order as PendingOrder };
}

export async function cancelPendingOrder(orderId: string): Promise<boolean> {
  const { error } = await supabase.rpc('cancel_pending_order', { p_order_id: orderId });
  if (error) {
    console.error('[Orders] cancel:', error);
    return false;
  }
  return true;
}

/** Liderazgo: posiciones abiertas de todos los clientes */
export async function getLeadershipOpenPositions(): Promise<
  Array<{
    id: string;
    client_id: string;
    symbol: string;
    type: string;
    volume: number;
    open_price: number;
    status: string;
    client_email?: string;
    client_name?: string;
  }>
> {
  const { data, error } = await supabase
    .from('positions')
    .select('id, client_id, symbol, type, volume, open_price, status, profiles(email, full_name)')
    .eq('status', 'OPEN')
    .order('opened_at', { ascending: false })
    .limit(200);

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    const prof = row.profiles as { email?: string; full_name?: string } | null;
    return {
      id: row.id as string,
      client_id: row.client_id as string,
      symbol: row.symbol as string,
      type: row.type as string,
      volume: Number(row.volume),
      open_price: Number(row.open_price),
      status: row.status as string,
      client_email: prof?.email,
      client_name: prof?.full_name,
    };
  });
}
