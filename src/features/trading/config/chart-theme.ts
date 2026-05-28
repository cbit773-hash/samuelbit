/** Tema oscuro del gráfico — alineado a Fortrade / PlatformShell */
export const CHART_THEME = {
  background: '#232629',
  text: '#b0b5ad',
  grid: 'rgba(255, 255, 255, 0.06)',
  upColor: '#10b981',
  downColor: '#ef4444',
  watermark: 'rgba(159, 232, 112, 0.06)',
  marketLine: 'rgba(159, 232, 112, 0.45)',
  orderLine: '#818cf8',
  slColor: '#f59e0b',
  tpColor: '#3b82f6',
} as const;

export function chartLayoutOptions() {
  return {
    background: { type: 'solid' as const, color: CHART_THEME.background },
    textColor: CHART_THEME.text,
  };
}

export function chartGridOptions() {
  return {
    vertLines: { color: CHART_THEME.grid },
    horzLines: { color: CHART_THEME.grid },
  };
}
