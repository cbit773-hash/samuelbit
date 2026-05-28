/** Moneda y tipo de cambio referencial Perú (cuenta opera en USD) */

export const MIN_DEPOSIT_USD = 250;
export const MIN_WITHDRAWAL_USD = 50;
export const MIN_CRYPTO_DEPOSIT_USD = 10;

const DEFAULT_PEN_USD_RATE = 3.75;

export function getPenUsdRate(): number {
  const env = import.meta.env.VITE_PEN_USD_RATE;
  if (env != null && env !== '') {
    const n = Number(env);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return DEFAULT_PEN_USD_RATE;
}

export function usdToPen(usd: number, rate = getPenUsdRate()): number {
  return Math.round(usd * rate * 100) / 100;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatPen(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Ej: "$250.00 USD (≈ S/ 937.50)" */
export function formatUsdWithPenEquivalent(usd: number, rate = getPenUsdRate()): string {
  return `${formatUsd(usd)} (≈ ${formatPen(usdToPen(usd, rate))})`;
}

export const FX_DISCLAIMER =
  'Tipo de cambio referencial (configurable). La cuenta opera en USD. El monto en soles es orientativo.';
