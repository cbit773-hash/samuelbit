import { CandlestickChart } from "../components/CandlestickChart";
import { OrderBook } from "../components/OrderBook";
import { PositionsList } from "../components/PositionsList";
import { useMarketWebSocket } from "../hooks/useMarketWebSocket";
import { useTradingStore } from "../store/trading.store";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState } from "react";

export function TradingTerminal() {
  useMarketWebSocket();
  const openPosition = useTradingStore((state) => state.openPosition);
  const [volume, setVolume] = useState("0.1");

  const handleBuy = () => openPosition('BUY', parseFloat(volume));
  const handleSell = () => openPosition('SELL', parseFloat(volume));

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Terminal de Trading</h1>
          <p className="text-gray-400">Datos en tiempo real alimentados por WebSockets.</p>
        </div>
      </div>

      {/* Main Trading Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        
        {/* Left: Order Book */}
        <div className="lg:col-span-3">
          <OrderBook />
        </div>

        {/* Center: Chart */}
        <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
            <div className="flex gap-2">
              <button className="bg-white/5 text-gray-300 px-3 py-1 rounded text-sm hover:text-white hover:bg-white/10">15m</button>
              <button className="bg-white/5 text-gray-300 px-3 py-1 rounded text-sm hover:text-white hover:bg-white/10">1H</button>
              <button className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm border border-primary/30">1D</button>
            </div>
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-white text-sm px-2">Indicadores</button>
            </div>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden">
            <CandlestickChart />
          </div>
        </div>

        {/* Right: Order Ticket */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col shadow-xl">
          <h3 className="text-white font-bold text-lg mb-6">Boleta de Orden</h3>
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-2 block">Tipo de Orden</label>
              <div className="flex bg-[#050505] p-1 rounded-lg border border-white/5">
                <button className="flex-1 bg-white/10 text-white rounded-md py-1.5 text-sm font-semibold">Mercado</button>
                <button className="flex-1 text-gray-500 rounded-md py-1.5 text-sm font-semibold hover:text-gray-300">Límite</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-2 block">Volumen (Lotes)</label>
              <div className="flex items-center bg-[#050505] border border-white/10 rounded-lg p-2">
                <button className="text-gray-500 hover:text-white px-3 font-bold" onClick={() => setVolume(v => (Math.max(0.01, parseFloat(v) - 0.01)).toFixed(2))}>-</button>
                <input type="text" value={volume} readOnly className="bg-transparent w-full text-center text-white font-mono font-bold outline-none" />
                <button className="text-gray-500 hover:text-white px-3 font-bold" onClick={() => setVolume(v => (parseFloat(v) + 0.01).toFixed(2))}>+</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={handleSell} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center transition-transform active:scale-95">
              <ArrowDownCircle size={20} className="mb-1 opacity-80" />
              <span>VENDER</span>
            </button>
            <button onClick={handleBuy} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center transition-transform active:scale-95">
              <ArrowUpCircle size={20} className="mb-1 opacity-80" />
              <span>COMPRAR</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom: Positions List */}
      <div className="w-full">
        <PositionsList />
      </div>
    </div>
  );
}
