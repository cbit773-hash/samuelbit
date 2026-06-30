import { createContext, useContext, type ReactNode } from 'react';
import { useClientPositions } from '../hooks/useClientPositions';
import { useRiskEngine } from '../hooks/useRiskEngine';

type TradingPositionsValue = ReturnType<typeof useClientPositions>;

const TradingPositionsContext = createContext<TradingPositionsValue | null>(null);

function RiskEngineRunner() {
  useRiskEngine();
  return null;
}

export function TradingPositionsProvider({ children }: { children: ReactNode }) {
  const positions = useClientPositions();

  return (
    <TradingPositionsContext.Provider value={positions}>
      <RiskEngineRunner />
      {children}
    </TradingPositionsContext.Provider>
  );
}

export function useTradingPositions() {
  const ctx = useContext(TradingPositionsContext);
  if (!ctx) {
    throw new Error('useTradingPositions debe usarse dentro de TradingPositionsProvider');
  }
  return ctx;
}
