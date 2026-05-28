import { useCallback, useEffect, useState } from 'react';
import {
  getMyOpenPositions,
  getMyClosedPositions,
  getClientAccountKPIs,
  openMyPosition,
  closePosition as closeDbPosition,
} from '../../../core/supabase/services/positions.service';
import type { Position as DbPosition } from '../../../core/supabase/database.types';
import { useAuthStore } from '../../auth/store/auth.store';
import { isDemoUserId } from '../../../core/supabase/demo-ids';
import { useClientDataOptional } from '../../client/context/ClientDataContext';
import { useTradingStore } from '../store/trading.store';
import { dbToStorePosition, calcFloatingPnl } from '../utils/position-mappers';
import { marketSymbolToDb } from '../utils/symbol-map';

export function useClientPositions() {
  const clientData = useClientDataOptional();
  const user = useAuthStore((s) => s.user);
  const isDemo = isDemoUserId(user?.id);

  const [openPositions, setOpenPositions] = useState<DbPosition[]>([]);
  const [closedPositions, setClosedPositions] = useState<DbPosition[]>([]);
  const [kpis, setKpis] = useState({ openPositions: 0, totalPnl: 0, floatingPnl: 0 });
  const [loading, setLoading] = useState(!clientData);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const syncStore = useCallback((open: DbPosition[]) => {
    const balance = useTradingStore.getState().balance;
    const storePositions = open.map(dbToStorePosition);
    useTradingStore.getState().setPositions(storePositions);
    useTradingStore.getState().setBalance(balance);
  }, []);

  const refresh = useCallback(async () => {
    if (clientData) {
      await clientData.refreshPositions();
      return;
    }

    if (isDemo) {
      setLoading(false);
      setError('Inicia sesi├│n con tu cuenta para ver posiciones en la plataforma.');
      setOpenPositions([]);
      setClosedPositions([]);
      useTradingStore.getState().setPositions([]);
      return;
    }

    setLoading(true);
    setError(null);
    const mode = useTradingStore.getState().accountMode;
    try {
      const [open, closed, stats] = await Promise.all([
        getMyOpenPositions(mode),
        getMyClosedPositions(mode),
        getClientAccountKPIs(undefined, mode),
      ]);
      setOpenPositions(open);
      setClosedPositions(closed);
      setKpis(stats);
      syncStore(open);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar posiciones');
    } finally {
      setLoading(false);
    }
  }, [clientData, isDemo, syncStore]);

  useEffect(() => {
    if (!clientData) {
      void refresh();
    }
  }, [clientData, refresh]);

  const openPosition = useCallback(
    async (params: {
      type: 'BUY' | 'SELL';
      volume: number;
      openPrice: number;
      symbol: string;
      stop_loss?: number | null;
      take_profit?: number | null;
    }) => {
      if (isDemo) return null;
      setSaving(true);
      try {
        const created = await openMyPosition({
          symbol: marketSymbolToDb(params.symbol),
          type: params.type,
          volume: params.volume,
          open_price: params.openPrice,
          stop_loss: params.stop_loss,
          take_profit: params.take_profit,
        });
        if (created) await refresh();
        return created;
      } catch (e) {
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [isDemo, refresh],
  );

  const closePosition = useCallback(
    async (id: string, closePrice: number) => {
      if (isDemo) return null;
      const storePos = useTradingStore.getState().positions.find((p) => p.id === id);
      const pnl = storePos ? calcFloatingPnl(storePos, closePrice) : 0;
      setSaving(true);
      const closed = await closeDbPosition(id, closePrice, pnl);
      setSaving(false);
      if (closed) await refresh();
      return closed;
    },
    [isDemo, refresh],
  );

  const closeAllOpenPositions = useCallback(
    async (symbol?: string) => {
      if (isDemo) return { closed: 0 };
      const state = useTradingStore.getState();
      const open = state.positions.filter(
        (p) =>
          p.status === 'OPEN' &&
          (!symbol || p.symbol === symbol),
      );
      if (open.length === 0) return { closed: 0 };

      setSaving(true);
      let closed = 0;
      try {
        for (const pos of open) {
          const price =
            state.prices[pos.symbol] ??
            (pos.symbol === state.activeSymbol ? state.currentPrice : null);
          if (price == null || !Number.isFinite(price)) continue;
          const pnl = calcFloatingPnl(pos, price);
          const ok = await closeDbPosition(pos.id, price, pnl);
          if (ok) closed += 1;
        }
        await refresh();
        useTradingStore.getState().setSelectedPositionId(null);
      } finally {
        setSaving(false);
      }
      return { closed };
    },
    [isDemo, refresh],
  );

  const storeOpen = useTradingStore((s) => s.positions);
  const currentPrice = useTradingStore((s) => s.currentPrice);

  const floatingPnl = storeOpen.reduce(
    (sum, p) => sum + calcFloatingPnl(p, currentPrice),
    0,
  );

  if (clientData) {
    const refreshWithMode = async () => {
      await clientData.refreshAll();
    };
    return {
      openPositions: clientData.openPositions,
      closedPositions: clientData.closedPositions,
      storeOpen,
      kpis: clientData.kpis,
      floatingPnl,
      loading: clientData.positionsLoading,
      error: clientData.positionsError,
      saving,
      isDemo,
      refresh: refreshWithMode,
      openPosition,
      closePosition,
      closeAllOpenPositions,
    };
  }

  return {
    openPositions,
    closedPositions,
    storeOpen,
    kpis,
    floatingPnl,
    loading,
    error,
    saving,
    isDemo,
    refresh,
    openPosition,
    closePosition,
    closeAllOpenPositions,
  };
}
