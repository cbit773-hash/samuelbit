import type { HTMLAttributes, ReactNode } from 'react';
import { darkUi } from '../theme/dark-ui';
import { cn } from './cn';

type Tone = 'canvas' | 'alt' | 'white' | 'info' | 'brand' | 'panel';

interface BoltSectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  canvas: `${darkUi.bgPage} ${darkUi.textPrimary}`,
  alt: `${darkUi.bgPanel} ${darkUi.textPrimary}`,
  white: `${darkUi.bgRaised} ${darkUi.textPrimary} border-y ${darkUi.border}`,
  info: `bg-[rgba(159,232,112,0.06)] ${darkUi.textPrimary}`,
  brand: 'bg-[#163300] text-[#f5f6f4]',
  panel: `${darkUi.bgRaised} ${darkUi.textPrimary}`,
};

const legacyMap: Record<string, Tone> = {
  dark: 'canvas',
  slate: 'alt',
  light: 'panel',
};

export function BoltSection({
  tone = 'canvas',
  className,
  children,
  ...props
}: BoltSectionProps) {
  const resolved = legacyMap[tone as string] ?? tone;
  return (
    <section className={cn(tones[resolved], 'py-[50px]', className)} {...props}>
      {children}
    </section>
  );
}
