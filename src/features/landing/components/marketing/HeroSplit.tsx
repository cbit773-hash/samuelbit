import type { ReactNode } from 'react';
import { BoltSection } from '../../../../shared/ui';

interface HeroSplitProps {
  id?: string;
  tone?: 'canvas' | 'alt' | 'white';
  badge?: ReactNode;
  visual: ReactNode;
  children: ReactNode;
  className?: string;
}

export function HeroSplit({
  id = 'inicio',
  tone = 'canvas',
  badge,
  visual,
  children,
  className,
}: HeroSplitProps) {
  return (
    <BoltSection
      id={id}
      tone={tone}
      className={`pt-24 pb-16 md:pt-28 md:pb-20 ${className ?? ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-6">{badge}{children}</div>
          <div className="order-1 lg:order-2">{visual}</div>
        </div>
      </div>
    </BoltSection>
  );
}
