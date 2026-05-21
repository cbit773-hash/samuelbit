// ============================================================
// INVESPRO — Servicio de Wallet (Supabase)
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

/** Obtener la wallet del usuario autenticado */
export async function getMyWallet(): Promise<Wallet | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('client_id', user.id)
    .single();

  if (error) { console.error('[Wallet] Error:', error); return null; }
  return data as Wallet;
}

/** Obtener wallet por client_id (para HEAD/CHIEF) */
export async function getWalletByClient(clientId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('client_id', clientId)
    .single();

  if (error) { console.error('[Wallet] Error:', error); return null; }
  return data as Wallet;
}

/** Obtener todas las wallets (HEAD) */
export async function getAllWallets(): Promise<Wallet[]> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .order('balance', { ascending: false });

  if (error) { console.error('[Wallet] Error:', error); return []; }
  return (data || []) as Wallet[];
}

// ─── Transaction Queries ─────────────────────────────────────

/** Obtener transacciones del usuario autenticado */
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

/** Obtener todas las transacciones (HEAD/CHIEF) */
export async function getAllTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('[Transactions] Error:', error); return []; }
  return (data || []) as Transaction[];
}

/** Obtener transacciones pendientes */
export async function getPendingTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) { console.error('[Transactions] Error:', error); return []; }
  return (data || []) as Transaction[];
}

// ─── Transaction Mutations ───────────────────────────────────

/** Crear solicitud de depósito */
export async function createDepositRequest(params: {
  amount: number;
  payment_method: string;
  gateway: string;
  external_id?: string;
  external_url?: string;
  crypto_address?: string;
  crypto_network?: string;
  notes?: string;
}): Promise<Transaction | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get or create wallet
  let wallet = await getMyWallet();
  if (!wallet) {
    const { data: newWallet } = await supabase
      .from('wallets')
      .insert({ client_id: user.id })
      .select()
      .single();
    wallet = newWallet as Wallet;
  }
  if (!wallet) return null;

  const fee = params.gateway === 'stripe' ? params.amount * 0.029 + 0.30 : 0;
  const net_amount = params.amount - fee;

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      wallet_id: wallet.id,
      client_id: user.id,
      type: 'deposit',
      amount: params.amount,
      fee: Math.round(fee * 100) / 100,
      net_amount: Math.round(net_amount * 100) / 100,
      payment_method: params.payment_method,
      status: params.gateway === 'manual' ? 'pending' : 'processing',
      gateway: params.gateway,
      external_id: params.external_id || null,
      external_url: params.external_url || null,
      crypto_address: params.crypto_address || null,
      crypto_network: params.crypto_network || null,
      notes: params.notes || null,
    })
    .select()
    .single();

  if (error) { console.error('[Transactions] Create error:', error); return null; }
  return data as Transaction;
}

/** Crear solicitud de retiro */
export async function createWithdrawalRequest(params: {
  amount: number;
  payment_method: string;
  crypto_address?: string;
  crypto_network?: string;
  notes?: string;
}): Promise<Transaction | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const wallet = await getMyWallet();
  if (!wallet || wallet.balance < params.amount) return null;
  if (wallet.is_frozen) return null;

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      wallet_id: wallet.id,
      client_id: user.id,
      type: 'withdrawal',
      amount: params.amount,
      fee: 0,
      net_amount: params.amount,
      payment_method: params.payment_method,
      status: 'pending',
      gateway: 'manual',
      crypto_address: params.crypto_address || null,
      crypto_network: params.crypto_network || null,
      notes: params.notes || null,
    })
    .select()
    .single();

  if (error) { console.error('[Transactions] Withdrawal error:', error); return null; }
  return data as Transaction;
}

/** Aprobar transacción (HEAD/CHIEF) — acredita en wallet */
export async function approveTransaction(txId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Get the transaction
  const { data: tx } = await supabase.from('transactions').select('*').eq('id', txId).single();
  if (!tx) return false;

  // Update transaction status
  const { error: txErr } = await supabase
    .from('transactions')
    .update({ status: 'completed', approved_by: user.id, completed_at: new Date().toISOString() })
    .eq('id', txId);
  if (txErr) return false;

  // Update wallet balance
  if (tx.type === 'deposit') {
    const { error: wErr } = await supabase.rpc('increment_wallet_balance', {
      p_wallet_id: tx.wallet_id,
      p_amount: tx.net_amount,
    });
    // Fallback if RPC doesn't exist
    if (wErr) {
      await supabase
        .from('wallets')
        .update({ 
          balance: (await getWalletByClient(tx.client_id))!.balance + Number(tx.net_amount),
          total_deposited: (await getWalletByClient(tx.client_id))!.total_deposited + Number(tx.net_amount),
        })
        .eq('id', tx.wallet_id);
    }
  } else if (tx.type === 'withdrawal') {
    const wallet = await getWalletByClient(tx.client_id);
    if (wallet) {
      await supabase
        .from('wallets')
        .update({ 
          balance: wallet.balance - Number(tx.amount),
          total_withdrawn: wallet.total_withdrawn + Number(tx.amount),
        })
        .eq('id', tx.wallet_id);
    }
  }

  return true;
}

/** Rechazar transacción */
export async function rejectTransaction(txId: string): Promise<boolean> {
  const { error } = await supabase
    .from('transactions')
    .update({ status: 'failed', completed_at: new Date().toISOString() })
    .eq('id', txId);
  return !error;
}
