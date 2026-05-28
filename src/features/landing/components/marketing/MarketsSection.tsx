import { BoltSection } from '../../../../shared/ui';
import { PERU_MARKETS } from '../../../../shared/copy/peru';
import { MarketCard } from './MarketCard';

interface MarketsSectionProps {
  id?: string;
  tone?: 'canvas' | 'alt' | 'white';
}

export function MarketsSection({ id = 'mercados', tone = 'canvas' }: MarketsSectionProps) {
  return (
    <BoltSection id={id} tone={tone}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Una cuenta, <span className="text-primary">todos los mercados</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Más de 200 instrumentos desde una sola plataforma. Opera 24/7 con condiciones transparentes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERU_MARKETS.map((m) => (
            <MarketCard
              key={m.id}
              icon={m.icon}
              title={m.title}
              desc={m.desc}
              items={m.items}
              utmTerm={m.utmTerm}
            />
          ))}
        </div>
      </div>
    </BoltSection>
  );
}
