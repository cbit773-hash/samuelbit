import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useTradingStore } from '../store/trading.store';

export function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const lastTimeRef = useRef<number>(0);
  const currentPrice = useTradingStore((state) => state.currentPrice);

  // Inicializar Gráfico
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#050505' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: 'rgba(245, 158, 11, 0.5)', width: 1, style: 3 },
        horzLine: { color: 'rgba(245, 158, 11, 0.5)', width: 1, style: 3 },
      },
      watermark: {
        visible: true,
        fontSize: 48,
        horzAlign: 'center',
        vertAlign: 'center',
        color: 'rgba(255, 255, 255, 0.03)',
        text: 'InvestPRO',
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    seriesRef.current = candlestickSeries;

    // Generar datos históricos simulados (velas diarias)
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    let time = now - 86400 * 100; // Hace 100 días
    let lastClose = 60000;
    for (let i = 0; i < 100; i++) {
      time += 86400;
      const open = lastClose + (Math.random() - 0.5) * 500;
      const close = open + (Math.random() - 0.5) * 1000;
      const high = Math.max(open, close) + Math.random() * 500;
      const low = Math.min(open, close) - Math.random() * 500;
      data.push({ time, open, high, low, close });
      lastClose = close;
    }
    candlestickSeries.setData(data as any);
    lastTimeRef.current = time;

    // Ajuste responsive
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Actualizar el gráfico en vivo con el WebSocket (protegido)
  useEffect(() => {
    if (!seriesRef.current || !currentPrice || !lastTimeRef.current) return;

    try {
      // Usar el día siguiente al último dato para asegurar orden ascendente
      const nextTime = lastTimeRef.current + 86400;
      seriesRef.current.update({
        time: nextTime as any,
        open: currentPrice - 50,
        high: currentPrice + 100,
        low: currentPrice - 100,
        close: currentPrice,
      });
    } catch {
      // Silenciar errores de orden de timestamps en actualizaciones rápidas
    }
  }, [currentPrice]);

  return (
    <div className="w-full h-full min-h-[400px] bg-[#050505] rounded-xl overflow-hidden relative">
      {/* Price Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-white font-bold text-2xl tracking-tight">BTC/USDT</h2>
        <div className={`text-xl font-mono ${currentPrice ? 'text-emerald-500' : 'text-gray-500'}`}>
          {currentPrice ? currentPrice.toFixed(2) : 'Conectando WS...'}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
