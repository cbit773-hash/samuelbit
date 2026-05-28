// ============================================================
// INVESPRO — Servicio de Wallet (Supabase — lectura + aprobación)
// Mutaciones de depósito/retiro vía Edge Functions / RPCs
// ============================================================
import { supabase } from '../client';

export interface Wallet {
  id: string;
  client_id: string;
  balance: number;
  currency: string;
  total_deposited: number;
  total_withdrawn: number;
  is_frozen: boolean;
  account_mode?: 'live' | 'demo' | null;
  demo_balance?: number | null;
  leverage?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  client_id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  external_id: string | null;
  external_url: string | null;
  invoice_id: string | null;
  payment_id: string | null;
  gateway: string | null;
  crypto_address: string | null;
  crypto_txid: string | null;
  crypto_network: string | null;
  notes: string | null;
  approved_by: string | null;
  created_at: string;
  completed_at: string | null;
}

// ─── Wallet Queries ──────────────────────────────────────────

export async function getMyWallet(): Promise<Wallet | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('client_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('[Wallet] Error:', error);
    throw new Error(error.message);
  }
  return data as Wallet | null;
}

/** Crea la fila en wallets si falta (RPC SECURITY DEFINER) y devuelve el registro */
export async function ensureMyWallet(): Promise<Wallet | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { error: rpcError } = await supabase.rpc('ensure_my_wallet');
  if (rpcError) {
    console.error('[Wallet] ensure_my_wallet:', rpcError);
    throw new Error(rpcError.message);
  }

  return getMyWallet();
}

/** Garantiza wallet + lectura (fuente única para el área cliente) */
export async function getMyWalletOrCreate(): Promise<Wallet | null> {
  const existing = await getMyWallet();
  if (existing) {
    await ensureDemoFunds();
    return getMyWallet();
  }
  const w = await ensureMyWallet();
  if (w) await ensureDemoFunds();
  return getMyWallet();
}

export async function ensureDemoFunds(): Promise<void> {
  const { error } = await supabase.rpc('ensure_demo_funds');
  if (error) console.error('[Wallet] ensure_demo_funds:', error);
}

export async function switchAccountMode(
  mode: 'demo' | 'live',
): Promise<{ account_mode: string; demo_balance: number; balance: number } | null> {
  const { data, error } = await supabase.rpc('switch_account_mode', { p_mode: mode });
  if (error) {
    console.error('[Wallet] switch_account_mode:', error);
    throw new Error(error.message);
  }
  return data as { account_mode: string; demo_balance: number; balance: number };
}

export async function resetDemoAccount(): Promise<boolean> {
  const { data, error } = await supabase.rpc('reset_demo_account');
  if (error) {
    console.error('[Wallet] reset_demo_account:', error);
    return false;
  }
  return !!(data as { ok?: boolean })?.ok;
}

export async function getWalletByClient(clientId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('client_id', clientId)
    .maybeSingle();

  if (error) { console.error('[Wallet] Error:', error); return null; }
  return data as Wallet | null;
}

export async function getAllWallets(): Promise<Wallet[]> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .order('balance', { ascending: false });

  if (error) { console.error('[Wallet] Error:', error); return []; }
  return (data || []) as Wallet[];
}

// ─── Transaction Queries ─────────────────────────────────────

export async function getMyTransactions(): Promise<Transaction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  if (error) { console.error('[Transactions] Error:', error); return []; }
  return (data || []) as Transaction[];
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('[Transactions] Error:', error); return []; }
  return (data || []) as Transaction[];
}

export async function getPendingTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .in('status', ['pending', 'processing'])
    .order('created_at', { ascending: false });

  if (error) { console.error('[Transactions] Error:', error); return []; }
  return (data || []) as Transaction[];
}

// ─── Leadership actions (Edge Function) ──────────────────────

export async function approveTransaction(txId: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('approve-transaction', {
    body: { transaction_id: txId, action: 'approve' },
  });

  if (error) {
    console.error('[approve-transaction]', error);
    return false;
  }

  return !!(data as { success?: boolean })?.success;
}

export async function rejectTransaction(txId: string, reason?: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('approve-transaction', {
    body: { transaction_id: txId, action: 'reject', reason },
  });

  if (error) {
    console.error('[reject-transaction]', error);
    return false;
  }

  return !!(data as { success?: boolean })?.success;
}

/**
 * @deprecated Use initiateCryptoDeposit / initiateManualDeposit from payment.service
 */
export async function createDepositRequest(): Promise<Transaction | null> {
  console.warn('[Wallet] createDepositRequest is deprecated — use payment.service');
  return null;
}

/**
 * @deprecated Use initiateWithdrawal from payment.service
 */
export async function createWithdrawalRequest(): Promise<Transaction | null> {
  console.warn('[Wallet] createWithdrawalRequest is deprecated — use payment.service');
  return null;
}
