import { Activity, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BoltSection } from '../../../../shared/ui';
import { TerminalVisual } from './TerminalVisual';

interface TerminalShowcaseProps {
  id?: string;
  tone?: 'canvas' | 'alt' | 'white';
}

export function TerminalShowcase({ id = 'plataforma', tone = 'alt' }: TerminalShowcaseProps) {
  const bullets = [
    'Gráficos en tiempo real con indicadores técnicos',
    'Precios vía WebSocket sin demoras',
    'Motor de margen y órdenes pendientes',
  ];

  return (
    <BoltSection id={id} tone={tone}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft border border-primary/20 text-primary font-semibold text-sm mb-6">
              <Zap size={16} /> Terminal InvestPRO
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Herramientas pro para traders modernos
            </h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Analítica en tiempo real, múltiples marcos temporales y ejecución rápida desde el navegador o móvil.
            </p>
            <ul className="space-y-4 mb-8">
              {bullets.map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted">
                  <div className="bg-primary-soft p-1.5 rounded-full shrink-0">
                    <Activity size={14} className="text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth/login" className="bolt-btn-primary inline-flex items-center gap-2">
                Probar demo
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/registro"
                className="inline-flex items-center font-semibold text-sm text-primary border border-primary/30 rounded-pill px-6 py-[13px] hover:bg-primary-soft transition-colors"
              >
                Abrir cuenta
              </Link>
            </div>
          </div>
          <TerminalVisual variant="platform" />
        </div>
      </div>
    </BoltSection>
  );
}
