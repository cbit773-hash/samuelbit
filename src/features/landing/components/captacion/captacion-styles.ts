/** Estilos del formulario de captación — tarjeta clara sobre shell oscuro */

/** Scope: evita que [data-theme=invest-dark] pinte títulos en blanco */
export const registroFormLightClass = 'registro-form-light';

export const registroTitleClass = 'text-[22px] font-bold text-[#0e0f0c] tracking-tight';

export const registroSubtitleClass =
  'text-[#454745] text-sm mt-1.5 leading-relaxed registro-text-body';

export const registroLabelClass =
  'block text-[13px] font-semibold text-[#2d302c] mb-1.5';

export const registroMutedClass = 'registro-text-muted';
export const registroSubtleClass = 'registro-text-subtle';

export const registroInputClass =
  'w-full min-h-[48px] px-4 rounded-[10px] border border-[#c5cac4] bg-white text-[#0e0f0c] text-[15px] placeholder:text-[#6b6f6b] transition-colors focus:outline-none focus:border-[#163300] focus:ring-2 focus:ring-[rgba(159,232,112,0.35)]';

export const registroInputWithIconClass = `${registroInputClass} pl-11`;

export const registroCtaClass =
  'w-full min-h-[52px] rounded-[10px] bg-brand hover:bg-brand-hover text-brand-ink font-bold text-[15px] tracking-tight transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

export const registroCardClass =
  `w-full max-w-[440px] ${registroFormLightClass} bg-surface-form text-[#0e0f0c] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.35)] px-7 py-8 sm:px-9 sm:py-10`;

export const registroErrorClass =
  'text-rose-700 text-sm text-center bg-rose-50 border border-rose-200 rounded-lg py-2.5 px-3';

export const registroPageBgClass = 'min-h-screen bg-background text-foreground';

/** Legacy */
export const captacionInputClass = 'bolt-input min-h-[48px]';
export const captacionLabelClass = 'block text-xs font-semibold text-muted mb-1.5';
