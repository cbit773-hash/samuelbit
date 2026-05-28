import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BoltSection } from '../../../../shared/ui';
import { PERU_CTA_BAND } from '../../../../shared/copy/peru';

interface CtaBandProps {
  tone?: 'canvas' | 'alt' | 'white';
}

export function CtaBand({ tone = 'alt' }: CtaBandProps) {
  return (
    <BoltSection tone={tone} className="text-center">
      <div className="max-w-3xl mx-auto px-4 py-4 rounded-card bg-surface border border-border">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          {PERU_CTA_BAND.title}
        </h2>
        <p className="text-lg text-muted mb-8">{PERU_CTA_BAND.subtitle}</p>
        <Link to="/registro" className="bolt-btn-primary inline-flex items-center gap-2 text-base">
          {PERU_CTA_BAND.primary}
          <ArrowRight size={20} />
        </Link>
        <p className="text-muted text-xs mt-6">{PERU_CTA_BAND.footnote}</p>
      </div>
    </BoltSection>
  );
}
