import type { AccountMode } from '../store/trading.store';
import type { Wallet } from '../../../core/supabase/services/wallet.service';

export const DEMO_STARTING_BALANCE = 10_000;

export function getWalletAccountMode(wallet: Wallet | null): AccountMode {
  const mode = wallet?.account_mode;
  return mode === 'live' || mode === 'demo' ? mode : 'demo';
}

export function getActiveBookBalance(wallet: Wallet | null, mode: AccountMode): number {
  if (!wallet) return 0;
  return mode === 'demo' ? Number(wallet.demo_balance ?? 0) : Number(wallet.balance ?? 0);
}
