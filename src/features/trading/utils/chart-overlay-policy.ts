import type { StorePosition } from '../store/trading.store';

const MAX_CHART_POSITIONS = 2;

function openedAtMs(pos: StorePosition): number {
  if (!pos.openedAt) return 0;
  const t = new Date(pos.openedAt).getTime();
  return Number.isFinite(t) ? t : 0;
}

/**
 * Elige qué posiciones OPEN dibujar en el gráfico (máx. 2):
 * - Siempre incluye selectedId si pertenece al símbolo.
 * - Completa con las más recientes por openedAt.
 */
export function pickPositionsForChart(
  openOnSymbol: StorePosition[],
  selectedId: string | null,
  max = MAX_CHART_POSITIONS,
): StorePosition[] {
  if (openOnSymbol.length === 0) return [];
  if (max <= 0) return [];

  const byRecent = [...openOnSymbol].sort((a, b) => openedAtMs(b) - openedAtMs(a));
  const picked: StorePosition[] = [];
  const seen = new Set<string>();

  if (selectedId) {
    const sel = openOnSymbol.find((p) => p.id === selectedId);
    if (sel) {
      picked.push(sel);
      seen.add(sel.id);
    }
  }

  for (const p of byRecent) {
    if (picked.length >= max) break;
    if (!seen.has(p.id)) {
      picked.push(p);
      seen.add(p.id);
    }
  }

  return picked;
}

export function getSelectedPosition(
  openOnSymbol: StorePosition[],
  selectedId: string | null,
): StorePosition | null {
  if (!selectedId) return null;
  return openOnSymbol.find((p) => p.id === selectedId) ?? null;
}
