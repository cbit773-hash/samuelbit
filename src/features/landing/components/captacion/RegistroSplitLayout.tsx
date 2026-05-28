import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  PERU_REGISTRO_BULLETS,
  PERU_REGISTRO_HERO,
  PERU_REGISTRO_SPLIT,
} from '../../../../shared/copy/peru';
import { CaptacionFormCard } from './CaptacionFormCard';
import type { CaptacionSubmitResult } from '../../types/captacion-form';

interface RegistroSplitLayoutProps {
  interest?: string;
  utmNotes?: string | null;
  onSuccess: (data: CaptacionSubmitResult) => void;
}

export function RegistroSplitLayout({ interest, utmNotes, onSuccess }: RegistroSplitLayoutProps) {
  const showInterest = interest && interest !== 'Desconocido';
  const split = PERU_REGISTRO_SPLIT;
  const hero = PERU_REGISTRO_HERO;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #9fe870 0%, transparent 45%), radial-gradient(circle at 80% 70%, #163300 0%, transparent 40%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen pt-[72px]">
        {/* Panel izquierdo — marca y confianza */}
        <aside className="order-2 lg:order-1 flex flex-col justify-between px-6 sm:px-10 lg:px-14 lg:py-12 lg:w-[52%] xl:w-[55%] pb-8 lg:pb-12">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              {hero.badge}
            </p>

            {showInterest && (
              <p className="mb-4 text-sm text-muted font-medium">
                {hero.interestBadge(interest)}
              </p>
            )}

            <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] font-bold tracking-tight text-foreground mb-4">
              {hero.title}
            </h1>

            <p className="text-[13px] sm:text-sm uppercase tracking-wide text-muted leading-relaxed mb-8">
              {split.tagline}
            </p>

            <ul className="space-y-4 mb-10">
              {PERU_REGISTRO_BULLETS.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[15px] text-foreground/90">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Check size={14} className="text-brand" strokeWidth={3} />
                  </span>
                  <span className="leading-snug">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-xl mt-8 lg:mt-0 hidden lg:block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-tertiary mb-2">
              {split.disclaimerTitle}
            </h2>
            <p className="text-[11px] leading-relaxed text-muted-tertiary max-h-[140px] overflow-y-auto pr-2 scrollbar-thin">
              {split.disclaimerBody}
            </p>
            <Link
              to="/legal/riesgos"
              className="inline-block mt-3 text-xs text-brand hover:underline font-medium"
            >
              {hero.riskLink}
            </Link>
          </div>
        </aside>

        {/* Panel derecho — formulario integrado */}
        <div className="order-1 lg:order-2 flex flex-1 items-center justify-center px-5 sm:px-8 lg:px-10 pt-2 pb-10 lg:py-12 lg:bg-surface-alt/50 lg:border-l lg:border-border">
          <CaptacionFormCard interest={interest} utmNotes={utmNotes} onSuccess={onSuccess} />
        </div>
      </div>

      {/* Disclaimer móvil */}
      <p className="lg:hidden px-6 pb-6 text-[10px] leading-relaxed text-muted-tertiary text-center max-w-lg mx-auto">
        {split.disclaimerBody.slice(0, 220)}…{' '}
        <Link to="/legal/riesgos" className="text-brand underline">
          Ver riesgos
        </Link>
      </p>
    </div>
  );
}
