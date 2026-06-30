/** Moneda local referencial — cuenta opera en USD */
const DEFAULT_LOCAL_USD_RATE = 1;

export function getLocalUsdRate(): number {
  const env = import.meta.env.VITE_LOCAL_USD_RATE;
  if (env) {
    const n = parseFloat(env);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return DEFAULT_LOCAL_USD_RATE;
}

export const MIN_CRYPTO_DEPOSIT_USD = 10;

export function usdToLocal(usd: number, rate = getLocalUsdRate()): number {
  return Math.round(usd * rate * 100) / 100;
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatLocal(amount: number): string {
  return amount.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatUsdWithLocalEquivalent(usd: number, rate = getLocalUsdRate()): string {
  const local = usdToLocal(usd, rate);
  return `${formatUsd(usd)} ≈ ${formatLocal(local)} (moneda local ref.)`;
}

export const FX_DISCLAIMER =
  'Tipo de cambio referencial. La acreditación en tu wallet es en USD.';
