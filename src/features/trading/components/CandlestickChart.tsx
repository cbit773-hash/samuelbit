import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from 'lightweight-charts';
import { MousePointerClick, Loader2 } from 'lucide-react';
import { useTradingStore } from '../store/trading.store';
import { useTradingChartData } from '../hooks/useTradingChartData';
import { useChartPositionOverlays } from '../hooks/useChartPositionOverlays';
import { CHART_THEME } from '../config/chart-theme';

export function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const prevSnapshotRef = useRef({ length: 0, firstTime: 0, lastTime: 0 });

  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const chartInterval = useTradingStore((s) => s.chartInterval);
  const wsStatus = useTradingStore((s) => s.wsStatus);

  const { candles, loading, error } = useTradingChartData();
  const [chartReady, setChartReady] = useState(false);

  useChartPositionOverlays(chartRef, seriesRef, chartReady);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: CHART_THEME.background },
        textColor: CHART_THEME.text,
      },
      grid: {
        vertLines: { color: CHART_THEME.grid },
        horzLines: { color: CHART_THEME.grid },
      },
      crosshair: { mode: 1 },
      watermark: {
        visible: true,
        fontSize: 48,
        horzAlign: 'center',
        vertAlign: 'center',
        color: CHART_THEME.watermark,
        text: 'InvestPRO',
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      rightPriceScale: { borderVisible: false },
    });

    chartRef.current = chart;
    seriesRef.current = chart.addCandlestickSeries({
      upColor: CHART_THEME.upColor,
      downColor: CHART_THEME.downColor,
      borderVisible: false,
      wickUpColor: CHART_THEME.upColor,
      wickDownColor: CHART_THEME.downColor,
    });
    setChartReady(true);

    chart.subscribeClick((param) => {
      if (!param.point || !seriesRef.current) return;
      const price = seriesRef.current.coordinateToPrice(param.point.y);
      if (price != null && Number.isFinite(price)) {
        const decimals = price > 1000 ? 2 : price > 1 ? 4 : 6;
        const rounded = Number(price.toFixed(decimals));
        useTradingStore.getState().setChartClickPrice(rounded);
      }
    });

    const ro = new ResizeObserver(() => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    });
    ro.observe(chartContainerRef.current);

    return () => {
      ro.disconnect();
      setChartReady(false);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      prevSnapshotRef.current = { length: 0, firstTime: 0, lastTime: 0 };
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || candles.length === 0) return;

    const first = candles[0]!.time;
    const last = candles[candles.length - 1]!;
    const snap = prevSnapshotRef.current;

    const isFullReload =
      snap.length === 0 ||
      candles.length !== snap.length ||
      first !== snap.firstTime;

    try {
      if (isFullReload) {
        series.setData(candles as CandlestickData<Time>[]);
        chartRef.current?.timeScale().fitContent();
      } else if (last.time > snap.lastTime) {
        series.update(last as CandlestickData<Time>);
      } else if (last.time === snap.lastTime) {
        series.update(last as CandlestickData<Time>);
      }
    } catch {
      series.setData(candles as CandlestickData<Time>[]);
      chartRef.current?.timeScale().fitContent();
    }

    prevSnapshotRef.current = {
      length: candles.length,
      firstTime: first,
      lastTime: last.time,
    };
  }, [candles]);

  useEffect(() => {
    prevSnapshotRef.current = { length: 0, firstTime: 0, lastTime: 0 };
    seriesRef.current?.setData([]);
  }, [activeSymbol, chartInterval]);

  return (
    <div className="w-full h-full min-h-[400px] bg-[#232629] overflow-hidden relative">
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-sm">
        <MousePointerClick size={12} className="text-[#b0b5ad] shrink-0" />
        <p className="text-[10px] text-[#b0b5ad] leading-tight">
          Clic en el gráfico → precio para Límite / Stop
        </p>
      </div>

      {loading && candles.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#232629]/90">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {error && candles.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#232629]/95 px-4">
          <p className="text-sm text-rose-400 text-center">{error}</p>
        </div>
      )}

      {wsStatus === 'offline' && candles.length > 0 && (
        <div className="absolute top-3 right-3 z-10 text-[10px] text-amber-400 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-1 rounded">
          Reconectando mercado…
        </div>
      )}

      <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
