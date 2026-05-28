const IMAGES = {
  hero: '/assets/hero-terminal-trader.jpg',
  platform: '/assets/hero-terminal-platform.jpg',
} as const;

export type TerminalVisualVariant = keyof typeof IMAGES;

interface TerminalVisualProps {
  /** hero = #inicio (LandingHero), platform = #plataforma (TerminalShowcase) */
  variant?: TerminalVisualVariant;
}

export function TerminalVisual({ variant = 'hero' }: TerminalVisualProps) {
  const src = IMAGES[variant];
  const objectPosition = variant === 'platform' ? 'object-[center_40%]' : 'object-[center_35%]';

  return (    <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto group">
      {/* Glow exterior — acento marca */}
      <div
        className="absolute -inset-1 rounded-[14px] bg-gradient-to-br from-brand/40 via-transparent to-brand/10 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-90"
        aria-hidden
      />

      <div className="relative rounded-card border border-border/80 bg-surface-alt/90 p-2 overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-white/10">
          <img
            src={src}
            alt="Profesional frente a terminal de trading con gráficos en tiempo real — InvestPRO"
            className={`absolute inset-0 h-full w-full object-cover ${objectPosition} scale-105 transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
            loading={variant === 'hero' ? 'eager' : 'lazy'}
            fetchPriority={variant === 'hero' ? 'high' : 'auto'}
            decoding="async"
          />

          {/* Vignette + profundidad */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0a0c0e] via-[#0a0c0e]/40 to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0a0c0e]/50 via-transparent to-[#0a0c0e]/30"
            aria-hidden
          />

          {/* Grid holográfico sutil */}
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-screen pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(159,232,112,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(159,232,112,0.35) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden
          />

          {/* Brillo animado en borde superior */}
          <div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/80 to-transparent"
            aria-hidden
          />

          {/* Badge LIVE */}
          <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5f6f4]">
              Mercado en vivo
            </span>
          </div>

          {/* Mini HUD inferior */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
              <p className="text-[9px] uppercase tracking-wider text-[#b0b5ad]">Terminal</p>
              <p className="font-mono text-sm font-bold text-brand">InvestPRO</p>
            </div>
            <div className="hidden sm:flex gap-1.5">
              {['15m', '1H', '1D'].map((tf) => (
                <span
                  key={tf}
                  className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-mono font-semibold text-[#f5f6f4]/90 backdrop-blur-sm"
                >
                  {tf}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'BTC/USD', value: '64,230', up: true },
          { label: 'EUR/USD', value: '1.0842', up: false },
          { label: 'S&P CFD', value: '5,421', up: true },
        ].map((t) => (
          <div
            key={t.label}
            className="bg-surface-alt/80 border border-border rounded-card px-2 py-2 text-center backdrop-blur-sm transition-colors hover:border-brand/30"
          >
            <p className="text-[10px] text-[#b0b5ad] uppercase tracking-wide font-medium">{t.label}</p>
            <p className={`font-mono text-sm font-bold ${t.up ? 'text-brand' : 'text-danger'}`}>
              {t.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
