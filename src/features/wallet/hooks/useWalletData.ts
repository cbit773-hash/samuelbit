import { useCallback } from 'react';
import { useClientDataOptional } from '../../client/context/ClientDataContext';
import {
  getMyWalletOrCreate,
  getMyTransactions,
  type Wallet,
  type Transaction,
} from '../../../core/supabase/services/wallet.service';

export { formatUsd } from '../utils/format-usd';

/**
 * Hook de wallet para componentes fuera del área cliente unificada.
 * Dentro del dashboard CLIENT delega a ClientDataProvider.
 */
export function useWalletData() {
  const clientData = useClientDataOptional();

  const refresh = useCallback(async () => {
    if (clientData) {
      await clientData.refreshWallet();
      return;
    }
    // Fallback sin provider (p. ej. tests)
    const [w, txs] = await Promise.all([getMyWalletOrCreate(), getMyTransactions()]);
    return { wallet: w, transactions: txs };
  }, [clientData]);

  if (clientData) {
    return {
      wallet: clientData.wallet,
      transactions: clientData.transactions,
      loading: clientData.walletLoading,
      error: clientData.walletError,
      refresh: clientData.refreshWallet,
    };
  }

  return {
    wallet: null as Wallet | null,
    transactions: [] as Transaction[],
    loading: false,
    error: null as string | null,
    refresh,
  };
}
