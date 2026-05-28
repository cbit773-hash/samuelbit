import { LineChart, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdvancedToolsSection() {
  return (
    <div id="plataformas" className="bg-background py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold mb-6">
              <Zap size={16} /> Terminal InvestPRO
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Herramientas avanzadas para comerciantes modernos</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Con nuestro conjunto completo de analíticas WebGL, puedes desbloquear todo el potencial de tus estrategias de trading. Utiliza características avanzadas como 9 marcos de tiempo, números Fibonacci y actualizaciones de precios en milisegundos.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Gráficos dinámicos integrados con Lightweight Charts",
                "Datos de precios sin demoras vía WebSocket",
                "Motor de margen automático y gestión de Stop Loss"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <div className="bg-primary/20 p-1 rounded-full">
                    <Activity size={16} className="text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/auth/login" className="inline-block bg-surface-alt hover:bg-surface-inset border border-border text-foreground font-bold py-3 px-8 rounded-full transition-all">
              Probar Terminal Demo
            </Link>
          </div>

          {/* Visual Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-rose-500/30 blur-[100px] rounded-full" />
            <div className="relative bg-surface border border-border rounded-2xl p-4 shadow-2xl">
              {/* Fake Terminal UI */}
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div className="flex gap-4">
                  <span className="text-foreground font-bold">BTC/USDT</span>
                  <span className="text-emerald-500 font-mono">64,230.50</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-surface-alt px-3 py-1 rounded text-xs text-muted">1H</span>
                  <span className="bg-surface-alt px-3 py-1 rounded text-xs text-muted">4H</span>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded text-xs font-bold">1D</span>
                </div>
              </div>
              
              <div className="h-64 w-full bg-surface-inset rounded-lg border border-border relative overflow-hidden flex items-center justify-center">
                {/* Abstract Chart Representation */}
                <LineChart size={120} className="text-foreground/5 absolute" />
                <div className="flex items-end gap-2 w-full h-full p-4 opacity-50">
                  <div className="w-1/6 bg-rose-500/80 h-1/3 rounded-t-sm"></div>
                  <div className="w-1/6 bg-emerald-500/80 h-1/2 rounded-t-sm"></div>
                  <div className="w-1/6 bg-emerald-500/80 h-3/4 rounded-t-sm"></div>
                  <div className="w-1/6 bg-rose-500/80 h-2/3 rounded-t-sm"></div>
                  <div className="w-1/6 bg-emerald-500/80 h-full rounded-t-sm"></div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <button className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 py-2 rounded-lg font-bold">COMPRAR</button>
                <button className="bg-rose-500/10 text-rose-500 border border-rose-500/20 py-2 rounded-lg font-bold">VENDER</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
