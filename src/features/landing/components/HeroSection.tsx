import { ArrowRight, BarChart3, ShieldCheck, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <div id="inicio" className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Plataforma Regulada Globalmente
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          Comercia derivados financieros con <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">
            nuestra plataforma galardonada.
          </span>
        </h1>

        <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Criptomonedas, Forex, Acciones, Materias Primas e Índices. Únete a miles de traders e invierte con spreads inteligentes y herramientas de análisis avanzadas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link to="/auth/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-amber-600 text-background font-bold text-lg px-8 py-4 rounded-full transition-all active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]">
            Empieza a invertir
            <ArrowRight size={20} />
          </Link>
          <Link to="/auth/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all">
            Explorar Mercados
          </Link>
        </div>

        {/* Stats / Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-white/10 pt-12">
          <div className="flex flex-col items-center">
            <Globe2 className="text-primary mb-3" size={32} />
            <h3 className="text-2xl font-bold text-white mb-1">150+</h3>
            <p className="text-gray-500 text-sm">Países Operativos</p>
          </div>
          <div className="flex flex-col items-center">
            <BarChart3 className="text-primary mb-3" size={32} />
            <h3 className="text-2xl font-bold text-white mb-1">3M+</h3>
            <p className="text-gray-500 text-sm">Órdenes Ejecutadas al Mes</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="text-primary mb-3" size={32} />
            <h3 className="text-2xl font-bold text-white mb-1">Cero</h3>
            <p className="text-gray-500 text-sm">Comisiones Ocultas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
