import { create } from 'zustand';

export interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
}

interface TradingState {
  activeSymbol: string;
  currentPrice: number | null;
  priceHistory: { time: string; value: number }[];
  marginLevel: number;
  equity: number;
  balance: number;
  positions: Position[];
  setActiveSymbol: (symbol: string) => void;
  setCurrentPrice: (price: number) => void;
  openPosition: (type: 'BUY' | 'SELL', volume: number) => void;
  closePosition: (id: string) => void;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  activeSymbol: 'BTCUSDT',
  currentPrice: null,
  priceHistory: [],
  marginLevel: 250.5,
  equity: 10450.20,
  balance: 10000.00,
  positions: [],
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
  setCurrentPrice: (price) => set((state) => {
    const newHistory = [...state.priceHistory, { time: new Date().toISOString(), value: price }].slice(-100);
    
    // Calcular equity dinámica si hay posiciones (Simulación)
    let dynamicEquity = state.balance;
    state.positions.forEach(pos => {
      const pnl = pos.type === 'BUY' ? (price - pos.openPrice) * pos.volume : (pos.openPrice - price) * pos.volume;
      dynamicEquity += pnl;
    });

    return { currentPrice: price, priceHistory: newHistory, equity: dynamicEquity };
  }),
  openPosition: (type, volume) => {
    const price = get().currentPrice;
    if (!price) return;
    
    const newPos: Position = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: get().activeSymbol,
      type,
      volume,
      openPrice: price,
    };
    
    set((state) => ({ positions: [...state.positions, newPos] }));
  },
  closePosition: (id) => {
    set((state) => ({
      positions: state.positions.filter(p => p.id !== id)
    }));
  }
}));
