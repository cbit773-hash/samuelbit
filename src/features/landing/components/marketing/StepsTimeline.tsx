import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BoltSection } from '../../../../shared/ui';
import { PERU_STEPS } from '../../../../shared/copy/peru';

interface StepsTimelineProps {
  tone?: 'canvas' | 'alt' | 'white';
}

export function StepsTimeline({ tone = 'white' }: StepsTimelineProps) {
  return (
    <BoltSection tone={tone}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
          Empieza en <span className="text-primary">3 pasos</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PERU_STEPS.map((s) => (
            <div key={s.step} className="relative bg-surface border border-border rounded-card p-6">
              <div className="w-14 h-14 rounded-card bg-primary-soft border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-black text-xl">{s.step}</span>
              </div>
              <h3 className="text-foreground font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-muted text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
        <Link to="/registro" className="bolt-btn-primary inline-flex items-center gap-2 text-base">
          Abrir cuenta gratis
          <ArrowRight size={20} />
        </Link>
      </div>
    </BoltSection>
  );
}
