import { useState } from 'react';
import { CandlestickChart } from '../components/CandlestickChart';
import { InstrumentWatchlist } from '../components/InstrumentWatchlist';
import { OrderPanel } from '../components/OrderPanel';
import { ChartToolbar } from '../components/ChartToolbar';
import { OperationsBottomPanel } from '../components/OperationsBottomPanel';
import { MobileOrderSheet } from '../components/MobileOrderSheet';
import { useMultiMarketStream } from '../hooks/useMultiMarketStream';
import { usePendingOrderWatcher } from '../hooks/usePendingOrderWatcher';
import { DemoAccountBanner } from '../components/DemoAccountBanner';
import { TradingPositionsProvider, useTradingPositions } from '../context/TradingPositionsContext';

function TradingWorkspaceInner() {
  const { refresh: refreshPositions } = useTradingPositions();
  const [mobileOrderOpen, setMobileOrderOpen] = useState(false);
  useMultiMarketStream();
  usePendingOrderWatcher(refreshPositions);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">
        <InstrumentWatchlist />
        <div className="flex flex-col flex-1 min-w-0">
          <DemoAccountBanner />
          <ChartToolbar />
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="relative flex-1 min-h-[240px] min-w-0">
              <CandlestickChart />
            </div>
            <OrderPanel />
          </div>
          <OperationsBottomPanel onOpenMobileOrder={() => setMobileOrderOpen(true)} />
        </div>
      </div>
      <MobileOrderSheet open={mobileOrderOpen} onClose={() => setMobileOrderOpen(false)} />
    </div>
  );
}

export function TradingWorkspace() {
  return (
    <TradingPositionsProvider>
      <TradingWorkspaceInner />
    </TradingPositionsProvider>
  );
}
