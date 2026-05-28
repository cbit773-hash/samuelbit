import { BarChart3, Building2, ShieldCheck } from 'lucide-react';
import { BoltSection } from '../../../../shared/ui';

const STATS = [
  { icon: Building2, title: 'SAC', desc: 'Empresa peruana' },
  { icon: BarChart3, title: '3M+', desc: 'Órdenes al mes' },
  { icon: ShieldCheck, title: 'Cero', desc: 'Comisiones ocultas' },
] as const;

export function TrustStatsBar() {
  return (
    <BoltSection tone="alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STATS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-6 rounded-card bg-surface border border-border"
            >
              <Icon className="text-primary mb-3" size={32} />
              <h3 className="text-2xl font-bold text-foreground mb-1">{title}</h3>
              <p className="text-muted text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </BoltSection>
  );
}
