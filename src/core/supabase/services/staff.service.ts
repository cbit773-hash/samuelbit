import { supabase } from '../client';
import type { Profile } from '../database.types';
import type { Transaction, Wallet } from './wallet.service';
import type { Lead } from '../database.types';

export interface ClientBundle {
  profile: Profile;
  wallet: Wallet | null;
  lead: Lead | null;
  transactions: Transaction[];
  calls: Array<{
    id: string;
    direction: string;
    status: string;
    duration_seconds: number | null;
    started_at: string;
  }>;
  positions_open_count: number;
  positions_closed_count: number;
}

export interface ClientPositionRow {
  id: string;
  symbol: string;
  type: string;
  volume: number;
  open_price: number;
  close_price: number | null;
  pnl: number | null;
  status: string;
  account_mode: string;
  opened_at: string;
  closed_at: string | null;
}

export type WalletBook = 'live' | 'demo';

export type StaffAuthAdminAction = 'reset_password' | 'ban_login' | 'unban_login';

export async function getClientBundle(clientId: string): Promise<ClientBundle | null> {
  const { data, error } = await supabase.rpc('staff_get_client_bundle', {
    p_client_id: clientId,
  });
  if (error) {
    console.error('[Staff] staff_get_client_bundle:', error);
    return null;
  }
  const bundle = data as {
    profile: Profile;
    wallet: Wallet | null;
    lead: Lead | null;
    transactions: Transaction[];
    calls: ClientBundle['calls'];
    positions_open_count?: number;
    positions_closed_count?: number;
  };
  if (!bundle?.profile) return null;
  return {
    profile: bundle.profile,
    wallet: bundle.wallet,
    lead: bundle.lead?.id ? bundle.lead : null,
    transactions: bundle.transactions ?? [],
    calls: bundle.calls ?? [],
    positions_open_count: bundle.positions_open_count ?? 0,
    positions_closed_count: bundle.positions_closed_count ?? 0,
  };
}

export async function listClientPositions(
  clientId: string,
  filters?: { status?: 'OPEN' | 'CLOSED'; accountMode?: WalletBook; limit?: number },
): Promise<ClientPositionRow[]> {
  const { data, error } = await supabase.rpc('staff_list_client_positions', {
    p_client_id: clientId,
    p_status: filters?.status ?? null,
    p_account_mode: filters?.accountMode ?? null,
    p_limit: filters?.limit ?? 50,
  });
  if (error) {
    console.error('[Staff] staff_list_client_positions:', error);
    return [];
  }
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    symbol: row.symbol as string,
    type: row.type as string,
    volume: Number(row.volume),
    open_price: Number(row.open_price),
    close_price: row.close_price != null ? Number(row.close_price) : null,
    pnl: row.pnl != null ? Number(row.pnl) : null,
    status: row.status as string,
    account_mode: row.account_mode as string,
    opened_at: row.opened_at as string,
    closed_at: (row.closed_at as string | null) ?? null,
  }));
}

export async function setClientWalletBalance(
  clientId: string,
  book: WalletBook,
  newBalance: number,
  reason: string,
): Promise<Wallet | null> {
  const { data, error } = await supabase.rpc('staff_set_client_wallet_balance', {
    p_client_id: clientId,
    p_book: book,
    p_new_balance: newBalance,
    p_reason: reason,
  });
  if (error) {
    console.error('[Staff] staff_set_client_wallet_balance:', error);
    throw new Error(error.message);
  }
  return data as Wallet;
}

export async function setClientBlocked(
  clientId: string,
  blocked: boolean,
  reason: string,
): Promise<{ profile: Profile; wallet: Wallet } | null> {
  const { data, error } = await supabase.rpc('staff_set_client_blocked', {
    p_client_id: clientId,
    p_blocked: blocked,
    p_reason: reason,
  });
  if (error) {
    console.error('[Staff] staff_set_client_blocked:', error);
    throw new Error(error.message);
  }
  const result = data as { profile: Profile; wallet: Wallet };
  return result ?? null;
}

export async function invokeStaffAuthAdmin(
  action: StaffAuthAdminAction,
  clientId: string,
): Promise<{ success: boolean; temporary_password?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('staff-auth-admin', {
    body: { client_id: clientId, action },
  });
  if (error) {
    console.error('[Staff] staff-auth-admin:', error);
    return { success: false, error: error.message };
  }
  const payload = data as { success?: boolean; temporary_password?: string; error?: string };
  if (payload?.error) {
    return { success: false, error: payload.error };
  }
  return {
    success: true,
    temporary_password: payload.temporary_password,
  };
}

export async function listClientProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.rpc('staff_list_profiles', {
    p_role: 'CLIENT',
    p_team_id: null,
  });
  if (error) {
    console.error('[Staff] staff_list_profiles CLIENT:', error);
    return [];
  }
  return (data ?? []) as Profile[];
}
