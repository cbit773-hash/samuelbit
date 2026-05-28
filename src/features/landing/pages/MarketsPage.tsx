import { MarketingNavbar } from "../components/marketing/MarketingNavbar";
import { Footer } from "../components/Footer";
import { MarketingShell } from "../../../shared/layout/MarketingShell";
import { TickerTape } from "../components/TickerTape";
import { LineChart, Globe, DollarSign, Bitcoin, Activity, BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function MarketsPage() {
  const assetClasses = [
    {
      id: "forex",
      title: "Forex (Mercado de Divisas)",
      icon: <DollarSign className="text-primary mb-4" size={40} />,
      description: "El mercado financiero más grande y líquido del mundo. Opera las 24 horas del día, 5 días a la semana, aprovechando las fluctuaciones entre las principales monedas globales.",
      highlights: ["Spreads desde 0.0 pips", "Apalancamiento hasta 1:500", "Más de 60 pares de divisas (Mayores, Menores y Exóticos)", "Ejecución ultra-rápida sin mesa de dinero (NDD)"],
      sampleSpreads: [
        { pair: "EUR/USD", spread: "0.1 pips" },
        { pair: "GBP/USD", spread: "0.3 pips" },
        { pair: "USD/JPY", spread: "0.2 pips" }
      ]
    },
    {
      id: "crypto",
      title: "Criptomonedas",
      icon: <Bitcoin className="text-primary mb-4" size={40} />,
      description: "Accede al mercado más volátil y dinámico del siglo XXI. Negocia CFDs sobre las principales criptomonedas sin la necesidad de un monedero digital ni el riesgo de hackeos a exchanges.",
      highlights: ["Operativa 24/7", "Apalancamiento hasta 1:100", "Liquidez profunda de múltiples exchanges", "Posiciones en largo (compra) y corto (venta)"],
      sampleSpreads: [
        { pair: "BTC/USDT", spread: "$1.50" },
        { pair: "ETH/USDT", spread: "$0.30" },
        { pair: "SOL/USDT", spread: "$0.02" }
      ]
    },
    {
      id: "stocks",
      title: "Acciones Globales",
      icon: <Globe className="text-primary mb-4" size={40} />,
      description: "Participa en el crecimiento de las empresas más grandes del mundo. Opera CFDs de acciones de los mercados de EE.UU., Europa y Asia con comisiones ultra bajas.",
      highlights: ["Cero comisiones en acciones de EE.UU.", "Ganancias por dividendos en posiciones largas", "Acceso a pre-market y after-hours", "Cobertura de más de 10,000 acciones"],
      sampleSpreads: [
        { pair: "AAPL", spread: "0.02 pts" },
        { pair: "TSLA", spread: "0.05 pts" },
        { pair: "AMZN", spread: "0.02 pts" }
      ]
    },
    {
      id: "indices",
      title: "Índices Bursátiles",
      icon: <BarChart2 className="text-primary mb-4" size={40} />,
      description: "Refleja el rendimiento de las economías enteras operando cestas de acciones. Ideal para estrategias macroeconómicas y diversificación de riesgo.",
      highlights: ["Bajos requisitos de margen", "Sin comisiones ocultas", "Principales índices: S&P 500, NASDAQ 100, DAX 40", "Excelente para day-trading y swing-trading"],
      sampleSpreads: [
        { pair: "US500", spread: "0.4 pts" },
        { pair: "US100", spread: "0.8 pts" },
        { pair: "DE40", spread: "0.9 pts" }
      ]
    },
    {
      id: "commodities",
      title: "Materias Primas",
      icon: <Activity className="text-primary mb-4" size={40} />,
      description: "Protege tu cartera contra la inflación o especula sobre la demanda global con oro, plata, petróleo crudo y gas natural.",
      highlights: ["Oro (XAU) y Plata (XAG) contra el USD", "Energías y materias primas agrícolas", "Cobertura efectiva contra la volatilidad del mercado", "Micro lotes disponibles"],
      sampleSpreads: [
        { pair: "XAU/USD", spread: "12 pts" },
        { pair: "Crude Oil", spread: "0.03 pts" },
        { pair: "Nat Gas", spread: "0.005 pts" }
      ]
    }
  ];

  return (
    <MarketingShell>
      <MarketingNavbar />
      <TickerTape />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-20 border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 w-full max-w-2xl h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
              Explora los Mercados Financieros con <span className="text-brand">InvestPRO</span>
            </h1>
            <p className="text-xl text-muted leading-relaxed mb-10">
              Obtén acceso directo a la liquidez global institucional. Opera más de 12,000 instrumentos financieros a través de múltiples clases de activos con ejecución ultrarrápida y spreads desde 0.0 pips.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/registro" className="bolt-btn-primary px-8 py-3.5">
                Abrir Cuenta Real
              </Link>
              <a href="#asset-classes" className="bolt-btn-ghost border border-border px-8 py-3.5">
                Ver Instrumentos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Market Data Strip */}
      <div className="bg-background py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/10">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Volumen Diario</p>
              <p className="text-2xl font-bold text-foreground">$12.5B+</p>
            </div>
            <div>
              <p className="text-muted text-sm font-medium mb-1">Instrumentos Disponibles</p>
              <p className="text-2xl font-bold text-foreground">12,000+</p>
            </div>
            <div>
              <p className="text-muted text-sm font-medium mb-1">Velocidad de Ejecución</p>
              <p className="text-2xl font-bold text-emerald-500">~12ms</p>
            </div>
            <div>
              <p className="text-muted text-sm font-medium mb-1">Proveedores de Liquidez</p>
              <p className="text-2xl font-bold text-foreground">Tier-1 Banks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Classes Sections */}
      <div id="asset-classes" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {assetClasses.map((asset, index) => (
            <div key={asset.id} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Content */}
              <div className="flex-1">
                <div className="inline-block p-4 bg-surface-alt rounded-2xl border border-border mb-6">
                  {asset.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{asset.title}</h2>
                <p className="text-lg text-muted mb-8 leading-relaxed">
                  {asset.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {asset.highlights.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Link to="/registro" className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand-hover transition-colors">
                  Comenzar a operar {asset.title} <ArrowRight size={18} />
                </Link>
              </div>

              {/* Data Display Mockup */}
              <div className="flex-1 w-full">
                <div className="bg-surface rounded-2xl border border-border p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                    <h3 className="text-foreground font-bold flex items-center gap-2">
                      <LineChart size={18} className="text-muted" />
                      Condiciones en Vivo
                    </h3>
                    <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-mono">Mercado Abierto</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 text-xs text-muted font-semibold uppercase tracking-wider mb-2">
                      <div>Instrumento</div>
                      <div className="text-right">Spread Mínimo</div>
                      <div className="text-right">Apalancamiento</div>
                    </div>
                    
                    {asset.sampleSpreads.map((spread, i) => (
                      <div key={i} className="grid grid-cols-3 items-center p-3 bg-surface-alt rounded-xl hover:bg-surface-info transition-colors border border-transparent hover:border-border">
                        <div className="font-bold text-foreground">{spread.pair}</div>
                        <div className="text-right text-emerald-400 font-mono text-sm">{spread.spread}</div>
                        <div className="text-right text-muted font-mono text-sm">1:{asset.id === 'crypto' ? '100' : '500'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border text-center">
                    <p className="text-xs text-muted">
                      Los spreads mostrados son indicativos y pueden variar dependiendo de la liquidez del mercado.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-surface-alt py-24 border-t border-border text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-6">¿Listo para aprovechar las oportunidades del mercado?</h2>
          <p className="text-muted text-lg mb-10">
            Únete a la plataforma elegida por traders institucionales y profesionales. Abre tu cuenta en minutos.
          </p>
          <Link to="/registro" className="inline-block bolt-btn-primary text-lg px-10 py-4">
            Crea tu Cuenta Ahora
          </Link>
        </div>
      </div>

      <Footer />
    </MarketingShell>
  );
}
