import type { ReactNode } from 'react';

interface CaptacionHeroBackgroundProps {
  children: ReactNode;
}

export function CaptacionHeroBackground({ children }: CaptacionHeroBackgroundProps) {
  return (
    <section className="relative min-h-screen flex flex-col">
      <div
        className="absolute inset-0 bg-background bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/captacion-terminal-bg.svg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-background/85" aria-hidden />

      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </section>
  );
}
