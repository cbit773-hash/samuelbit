/** InvestPRO shell — tema oscuro + lima (landing y roles) */
export const investTheme = {
  bgShell: '#1a1d21',
  bgPanel: '#2a2d30',
  bgRail: '#232629',
  surfaceElevated: '#32363a',
  surfaceInset: '#232629',
  surfaceInfo: 'rgba(159, 232, 112, 0.08)',
  surfaceForm: '#ffffff',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
  brand: '#9fe870',
  brandHover: '#8fd85f',
  brandInk: '#163300',
  cta: '#9fe870',
  ctaHover: '#8fd85f',
  ctaSoft: 'rgba(159, 232, 112, 0.12)',
  accentLime: '#9fe870',
  textPrimary: '#f5f6f4',
  textSecondary: 'rgba(245, 246, 244, 0.72)',
  textMuted: 'rgba(245, 246, 244, 0.45)',
  canvas: '#1a1d21',
  buyGreen: '#9fe870',
  sellRed: '#ef4444',
  radiusPanel: '12px',
  radiusButton: '10px',
  spacingPanel: 28,
} as const;

export const useInvestShell = (): boolean =>
  import.meta.env.VITE_FORTADE_SHELL !== 'false';

/** @deprecated Use investTheme */
export const boltTheme = investTheme;
