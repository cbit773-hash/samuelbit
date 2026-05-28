import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrustBar } from '../../../../shared/components/TrustBar';
import { BoltBadge } from '../../../../shared/ui';
import { PERU_HERO, PERU_HERO_CTA, PERU_MIN_DEPOSIT_LABEL } from '../../../../shared/copy/peru';
import { darkUi } from '../../../../shared/theme/dark-ui';
import { HeroSplit } from './HeroSplit';
import { TriggerRotator } from './TriggerRotator';
import { TerminalVisual } from './TerminalVisual';

export function LandingHero() {
  return (
    <HeroSplit
      tone="canvas"
      visual={<TerminalVisual />}
      badge={
        <BoltBadge className="w-fit">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
            {PERU_HERO.badge}
          </span>
        </BoltBadge>
      }
    >
      <TriggerRotator />
      <h1 className={`font-bold text-4xl md:text-[64px] leading-[1.1] tracking-[-0.02em] ${darkUi.textPrimary}`}>
        {PERU_HERO.title}
      </h1>
      <p className={`text-lg ${darkUi.textSecondary} leading-relaxed max-w-xl`}>{PERU_HERO.subtitle}</p>
      <p className="text-sm text-brand font-semibold font-mono">Desde {PERU_MIN_DEPOSIT_LABEL}</p>
      <TrustBar compact />
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
        <Link to="/registro" className="bolt-btn-primary inline-flex items-center justify-center gap-2">
          {PERU_HERO_CTA.primary}
          <ArrowRight size={20} />
        </Link>
        <Link
          to="/mercados"
          className="inline-flex items-center justify-center gap-2 font-semibold text-sm text-brand border-2 border-brand/30 bg-surface-alt hover:bg-primary-soft rounded-pill px-6 py-[11px] transition-colors"
        >
          {PERU_HERO_CTA.secondary}
        </Link>
        <Link
          to="/auth/login"
          className={`text-sm font-semibold ${darkUi.textPrimary} hover:text-[#9fe870] py-[13px] px-4 transition-colors`}
        >
          {PERU_HERO_CTA.tertiary}
        </Link>
      </div>
    </HeroSplit>
  );
}
