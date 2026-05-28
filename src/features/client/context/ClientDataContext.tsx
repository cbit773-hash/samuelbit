import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  getMyTransactions,
  getMyWalletOrCreate,
  type Transaction,
  type Wallet,
} from '../../../core/supabase/services/wallet.service';
import {
  getMyOpenPositions,
  getMyClosedPositions,
  getClientAccountKPIs,
} from '../../../core/supabase/services/positions.service';
import type { Position as DbPosition } from '../../../core/supabase/database.types';
import { useAuthStore } from '../../auth/store/auth.store';
import { isDemoUserId } from '../../../core/supabase/demo-ids';
import { useTradingStore } from '../../trading/store/trading.store';
import { dbToStorePosition } from '../../trading/utils/position-mappers';
import { getActiveBookBalance, getWalletAccountMode } from '../../trading/utils/trading-account';

const WALLET_TIMEOUT_MS = 15_000;

export interface ClientDataContextValue {
  wallet: Wallet | null;
  transactions: Transaction[];
  walletLoading: boolean;
  walletError: string | null;
  refreshWallet: () => Promise<void>;
  openPositions: DbPosition[];
  closedPositions: DbPosition[];
  kpis: { openPositions: number; totalPnl: number; floatingPnl: number };
  positionsLoading: boolean;
  positionsError: string | null;
  refreshPositions: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const ClientDataContext = createContext<ClientDataContextValue | null>(null);

function syncTradingFromWalletAndPositions(
  wallet: Wallet | null,
  open: DbPosition[],
) {
  const { setBalance, setLeverage, setAccountMode, setPositions } = useTradingStore.getState();
  const mode = getWalletAccountMode(wallet);
  setAccountMode(mode);
  setBalance(getActiveBookBalance(wallet, mode));
  setPositions(open.map(dbToStorePosition));

  const lev = wallet?.leverage;
  if (lev) setLeverage(lev);
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

export function ClientDataProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const isDemo = isDemoUserId(user?.id);

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);

  const [openPositions, setOpenPositions] = useState<DbPosition[]>([]);
  const [closedPositions, setClosedPositions] = useState<DbPosition[]>([]);
  const [kpis, setKpis] = useState({ openPositions: 0, totalPnl: 0, floatingPnl: 0 });
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [positionsError, setPositionsError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshWallet = useCallback(async () => {
    if (role !== 'CLIENT' || !user || isDemo) {
      setWalletLoading(false);
      return;
    }

    setWalletLoading(true);
    setWalletError(null);
    try {
      const [w, txs] = await withTimeout(
        Promise.all([getMyWalletOrCreate(), getMyTransactions()]),
        WALLET_TIMEOUT_MS,
        'No se pudo cargar la billetera. Revisa tu conexi├│n e intenta de nuevo.',
      );
      if (!mountedRef.current) return;
      setWallet(w);
      setTransactions(txs);
      const mode = getWalletAccountMode(w);
      useTradingStore.getState().setAccountMode(mode);
      useTradingStore.getState().setBalance(getActiveBookBalance(w, mode));
      if (w?.leverage) useTradingStore.getState().setLeverage(w.leverage);
    } catch (e) {
      if (!mountedRef.current) return;
      setWalletError(e instanceof Error ? e.message : 'Error al cargar billetera');
    } finally {
      if (mountedRef.current) setWalletLoading(false);
    }
  }, [role, user, isDemo]);

  const refreshPositions = useCallback(async () => {
    if (role !== 'CLIENT' || !user || isDemo) {
      setPositionsLoading(false);
      return;
    }

    setPositionsLoading(true);
    setPositionsError(null);
    try {
      const mode = getWalletAccountMode(wallet);
      const [open, closed, stats] = await Promise.all([
        getMyOpenPositions(mode),
        getMyClosedPositions(mode),
        getClientAccountKPIs(undefined, mode),
      ]);
      if (!mountedRef.current) return;
      setOpenPositions(open);
      setClosedPositions(closed);
      setKpis(stats);
      syncTradingFromWalletAndPositions(wallet, open);
    } catch (e) {
      if (!mountedRef.current) return;
      setPositionsError(e instanceof Error ? e.message : 'Error al cargar posiciones');
    } finally {
      if (mountedRef.current) setPositionsLoading(false);
    }
  }, [role, user, isDemo, wallet]);

  const refreshAll = useCallback(async () => {
    if (role !== 'CLIENT' || !user || isDemo) {
      setWalletLoading(false);
      setPositionsLoading(false);
      return;
    }

    setWalletLoading(true);
    setPositionsLoading(true);
    setWalletError(null);
    setPositionsError(null);

    try {
      const w = await getMyWalletOrCreate();
      const mode = getWalletAccountMode(w);
      const [txs, open, closed, stats] = await withTimeout(
        Promise.all([
          getMyTransactions(),
          getMyOpenPositions(mode),
          getMyClosedPositions(mode),
          getClientAccountKPIs(undefined, mode),
        ]),
        WALLET_TIMEOUT_MS,
        'No se pudo cargar la billetera. Revisa tu conexi├│n e intenta de nuevo.',
      );
      if (!mountedRef.current) return;
      setWallet(w);
      setTransactions(txs);
      setOpenPositions(open);
      setClosedPositions(closed);
      setKpis(stats);
      syncTradingFromWalletAndPositions(w, open);
    } catch (e) {
      if (!mountedRef.current) return;
      const msg = e instanceof Error ? e.message : 'Error al cargar datos';
      setWalletError(msg);
      setPositionsError(msg);
    } finally {
      if (mountedRef.current) {
        setWalletLoading(false);
        setPositionsLoading(false);
      }
    }
  }, [role, user, isDemo]);

  useEffect(() => {
    if (role !== 'CLIENT' || !user || isDemo) {
      setWalletLoading(false);
      setPositionsLoading(false);
      return;
    }
    void refreshAll();
  }, [role, user?.id, isDemo, refreshAll]);

  const value: ClientDataContextValue = {
    wallet,
    transactions,
    walletLoading,
    walletError,
    refreshWallet,
    openPositions,
    closedPositions,
    kpis,
    positionsLoading,
    positionsError,
    refreshPositions,
    refreshAll,
  };

  return (
    <ClientDataContext.Provider value={value}>{children}</ClientDataContext.Provider>
  );
}

export function useClientData(): ClientDataContextValue {
  const ctx = useContext(ClientDataContext);
  if (!ctx) {
    throw new Error('useClientData debe usarse dentro de ClientDataProvider');
  }
  return ctx;
}

export function useClientDataOptional(): ClientDataContextValue | null {
  return useContext(ClientDataContext);
}
