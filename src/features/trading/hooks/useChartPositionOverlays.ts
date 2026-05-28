import { useEffect, useRef } from 'react';
import type { IChartApi, ISeriesApi, SeriesMarker, Time } from 'lightweight-charts';
import { useTradingStore } from '../store/trading.store';
import { openedAtToBucket } from '../utils/chart-time';
import { CHART_THEME } from '../config/chart-theme';
import {
  pickPositionsForChart,
  getSelectedPosition,
} from '../utils/chart-overlay-policy';

type CandleSeries = ISeriesApi<'Candlestick'>;

interface PriceLineHandle {
  remove: () => void;
}

export function useChartPositionOverlays(
  _chartRef: React.RefObject<IChartApi | null>,
  seriesRef: React.RefObject<CandleSeries | null>,
  chartReady: boolean,
) {
  const activeSymbol = useTradingStore((s) => s.activeSymbol);
  const chartInterval = useTradingStore((s) => s.chartInterval);
  const positions = useTradingStore((s) => s.positions);
  const currentPrice = useTradingStore((s) => s.currentPrice);
  const chartClickPrice = useTradingStore((s) => s.chartClickPrice);
  const selectedPositionId = useTradingStore((s) => s.selectedPositionId);
  const showChartEntries = useTradingStore((s) => s.showChartEntries);

  const lineHandlesRef = useRef<PriceLineHandle[]>([]);
  const clickLineRef = useRef<PriceLineHandle | null>(null);
  const lastPriceLineRef = useRef<PriceLineHandle | null>(null);

  const clearLines = () => {
    lineHandlesRef.current.forEach((h) => h.remove());
    lineHandlesRef.current = [];
    clickLineRef.current?.remove();
    clickLineRef.current = null;
    lastPriceLineRef.current?.remove();
    lastPriceLineRef.current = null;
  };

  useEffect(() => {
    if (!chartReady) return;
    const series = seriesRef.current;
    if (!series) return;

    clearLines();

    const openOnSymbol = positions.filter(
      (p) => p.status === 'OPEN' && p.symbol === activeSymbol,
    );

    const selected = getSelectedPosition(openOnSymbol, selectedPositionId);
    const toDraw = showChartEntries
      ? pickPositionsForChart(openOnSymbol, selectedPositionId)
      : [];

    const markers: SeriesMarker<Time>[] = [];

    for (const pos of toDraw) {
      const isBuy = pos.type === 'BUY';
      const color = isBuy ? CHART_THEME.upColor : CHART_THEME.downColor;
      const isSelected = pos.id === selected?.id;

      const entryLine = series.createPriceLine({
        price: pos.openPrice,
        color,
        lineWidth: isSelected ? 2 : 1,
        lineStyle: isSelected ? 0 : 2,
        axisLabelVisible: isSelected,
        title: isSelected ? `${pos.type} ${pos.volume}` : '',
      });
      lineHandlesRef.current.push({ remove: () => series.removePriceLine(entryLine) });

      if (isSelected) {
        if (pos.stopLoss != null && pos.stopLoss > 0) {
          const slLine = series.createPriceLine({
            price: pos.stopLoss,
            color: CHART_THEME.slColor,
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
            title: 'SL',
          });
          lineHandlesRef.current.push({ remove: () => series.removePriceLine(slLine) });
        }

        if (pos.takeProfit != null && pos.takeProfit > 0) {
          const tpLine = series.createPriceLine({
            price: pos.takeProfit,
            color: CHART_THEME.tpColor,
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
            title: 'TP',
          });
          lineHandlesRef.current.push({ remove: () => series.removePriceLine(tpLine) });
        }

        const markerTime = openedAtToBucket(pos.openedAt, chartInterval);
        if (markerTime != null) {
          markers.push({
            time: markerTime as Time,
            position: isBuy ? 'belowBar' : 'aboveBar',
            color,
            shape: isBuy ? 'arrowUp' : 'arrowDown',
            text: `${pos.type} ${pos.volume}`,
          });
        }
      }
    }

    markers.sort((a, b) => (a.time as number) - (b.time as number));
    series.setMarkers(markers);

    if (currentPrice != null && Number.isFinite(currentPrice)) {
      const lastLine = series.createPriceLine({
        price: currentPrice,
        color: CHART_THEME.marketLine,
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'Mercado',
      });
      lastPriceLineRef.current = { remove: () => series.removePriceLine(lastLine) };
    }

    return () => {
      clearLines();
      series.setMarkers([]);
    };
  }, [
    positions,
    activeSymbol,
    chartInterval,
    currentPrice,
    selectedPositionId,
    showChartEntries,
    seriesRef,
    chartReady,
  ]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || !chartReady) return;

    clickLineRef.current?.remove();
    clickLineRef.current = null;

    if (chartClickPrice == null || !Number.isFinite(chartClickPrice)) return;

    const line = series.createPriceLine({
      price: chartClickPrice,
      color: CHART_THEME.orderLine,
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Precio orden',
    });
    clickLineRef.current = { remove: () => series.removePriceLine(line) };

    return () => {
      clickLineRef.current?.remove();
      clickLineRef.current = null;
    };
  }, [chartClickPrice, chartReady, seriesRef, activeSymbol]);
}
