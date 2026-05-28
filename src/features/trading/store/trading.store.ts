import { create } from 'zustand';
import {
  calcEquityFromPositions,
  calcUsedMargin,
  calcFreeMargin,
  calcMarginLevel,
  DEFAULT_LEVERAGE,
} from '../utils/margin.calculator';
import { calcFloatingPnl } from '../utils/position-mappers';

export interface StorePosition {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  closePrice?: number | null;
  pnl?: number | null;
  status: 'OPEN' | 'CLOSED';
  stopLoss?: number | null;
  takeProfit?: number | null;
  openedAt?: string;
  closedAt?: string | null;
}

export type WsConnectionStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';
export type AccountMode = 'demo' | 'live';
export type ChartInterval = '15m' | '1h' | '1d';

export interface ChartOhlc {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradingState {
  activeSymbol: string;
  currentPrice: number | null;
  prices: Record<string, number>;
  priceHistory: Record<string, { time: number; value: number }[]>;
  wsStatus: WsConnectionStatus;
  lastTickAt: number | null;
  marginLevel: number;
  equity: number;
  balance: number;
  usedMargin: number;
  freeMargin: number;
  floatingPnl: number;
  leverage: number;
  accountMode: AccountMode;
  orderVolume: string;
  orderStopLoss: string;
  orderTakeProfit: string;
  positions: StorePosition[];
  chartInterval: ChartInterval;
  chartClickPrice: number | null;
  selectedPositionId: string | null;
  showChartEntries: boolean;
  setActiveSymbol: (symbol: string) => void;
  setCurrentPrice: (price: number) => void;
  setPrice: (symbol: string, price: number) => void;
  setWsStatus: (status: WsConnectionStatus) => void;
  setLastTickAt: (ts: number) => void;
  setPositions: (positions: StorePosition[]) => void;
  setBalance: (balance: number) => void;
  setLeverage: (leverage: number) => void;
  setAccountMode: (mode: AccountMode) => void;
  setOrderVolume: (value: string) => void;
  setOrderStopLoss: (value: string) => void;
  setOrderTakeProfit: (value: string) => void;
  setChartInterval: (interval: ChartInterval) => void;
  setChartClickPrice: (price: number | null) => void;
  setSelectedPositionId: (id: string | null) => void;
  setShowChartEntries: (show: boolean) => void;
}

function priceMap(activeSymbol: string, currentPrice: number | null): Record<string, number> {
  if (currentPrice == null) return {};
  return { [activeSymbol]: currentPrice };
}

function deriveMetrics(state: {
  balance: number;
  positions: StorePosition[];
  activeSymbol: string;
  currentPrice: number | null;
  leverage: number;
}) {
  const prices = priceMap(state.activeSymbol, state.currentPrice);
  const open = state.positions.filter((p) => p.status === 'OPEN');
  const equity = calcEquityFromPositions(state.balance, state.positions, prices);
  const usedMargin = calcUsedMargin(state.positions, prices, state.leverage);
  const freeMargin = calcFreeMargin(equity, usedMargin);
  return {
    equity,
    usedMargin,
    freeMargin,
    marginLevel: calcMarginLevel(equity, usedMargin),
    floatingPnl: open.reduce(
      (sum, p) => sum + calcFloatingPnl(p, prices[p.symbol] ?? null),
      0,
    ),
  };
}

export const useTradingStore = create<TradingState>((set) => ({
  activeSymbol: 'BTCUSDT',
  currentPrice: null,
  prices: {},
  priceHistory: {},
  wsStatus: 'offline',
  lastTickAt: null,
  marginLevel: 999,
  equity: 0,
  balance: 0,
  usedMargin: 0,
  freeMargin: 0,
  floatingPnl: 0,
  leverage: DEFAULT_LEVERAGE,
  accountMode: 'demo',
  orderVolume: '0.01',
  orderStopLoss: '',
  orderTakeProfit: '',
  positions: [],
  chartInterval: '15m',
  chartClickPrice: null,
  selectedPositionId: null,
  showChartEntries: true,

  setActiveSymbol: (symbol) =>
    set((state) => {
      const cached = state.prices[symbol] ?? null;
      return {
        activeSymbol: symbol,
        currentPrice: cached,
        chartClickPrice: null,
        selectedPositionId: null,
        ...deriveMetrics({ ...state, activeSymbol: symbol, currentPrice: cached }),
      };
    }),

  setWsStatus: (wsStatus) => set({ wsStatus }),

  setLastTickAt: (lastTickAt) => set({ lastTickAt }),

  setPositions: (positions) =>
    set((state) => ({ positions, ...deriveMetrics({ ...state, positions }) })),

  setBalance: (balance) =>
    set((state) => ({ balance, ...deriveMetrics({ ...state, balance }) })),

  setLeverage: (leverage) =>
    set((state) => ({ leverage, ...deriveMetrics({ ...state, leverage }) })),

  setAccountMode: (accountMode) => set({ accountMode }),

  setOrderVolume: (orderVolume) => set({ orderVolume }),
  setOrderStopLoss: (orderStopLoss) => set({ orderStopLoss }),
  setOrderTakeProfit: (orderTakeProfit) => set({ orderTakeProfit }),

  setChartInterval: (chartInterval) => set({ chartInterval, chartClickPrice: null }),

  setChartClickPrice: (chartClickPrice) => set({ chartClickPrice }),

  setSelectedPositionId: (selectedPositionId) => set({ selectedPositionId }),

  setShowChartEntries: (showChartEntries) => set({ showChartEntries }),

  setPrice: (symbol, price) =>
    set((state) => {
      const ts = Date.now();
      const prev = state.priceHistory[symbol] ?? [];
      const symHistory = [...prev, { time: ts, value: price }].slice(-100);
      const prices = { ...state.prices, [symbol]: price };
      const priceHistory = { ...state.priceHistory, [symbol]: symHistory };
      const base = { prices, priceHistory, lastTickAt: ts };
      if (symbol === state.activeSymbol) {
        return {
          ...base,
          currentPrice: price,
          ...deriveMetrics({ ...state, currentPrice: price }),
        };
      }
      return base;
    }),

  setCurrentPrice: (price) =>
    set((state) => {
      const sym = state.activeSymbol;
      const ts = Date.now();
      const prev = state.priceHistory[sym] ?? [];
      const symHistory = [...prev, { time: ts, value: price }].slice(-100);
      const prices = { ...state.prices, [sym]: price };
      const priceHistory = { ...state.priceHistory, [sym]: symHistory };
      return {
        currentPrice: price,
        prices,
        priceHistory,
        lastTickAt: ts,
        ...deriveMetrics({ ...state, currentPrice: price }),
      };
    }),
}));

/** Precio en vivo del símbolo activo del gráfico */
export function useActivePrice(): number | null {
  return useTradingStore((s) => s.currentPrice);
}

/** Precio en vivo de cualquier símbolo del watchlist (multi-market stream) */
export function useSymbolPrice(symbol: string): number | null {
  return useTradingStore((s) => s.prices[symbol] ?? null);
}
