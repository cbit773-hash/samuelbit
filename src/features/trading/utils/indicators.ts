/** Vela OHLC para indicadores (time en segundos UTC, estilo lightweight-charts) */
export interface IndicatorCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface IndicatorPoint {
  time: number;
  value: number;
}

export interface BollingerPoint {
  time: number;
  upper: number;
  middle: number;
  lower: number;
}

export interface IndicatorConfig {
  smaPeriod: number;
  bbPeriod: number;
  bbStdDev: number;
  rsiPeriod: number;
}

export const DEFAULT_INDICATOR_CONFIG: IndicatorConfig = {
  smaPeriod: 20,
  bbPeriod: 20,
  bbStdDev: 2,
  rsiPeriod: 14,
};

export interface IndicatorResult {
  sma: IndicatorPoint[];
  bollinger: BollingerPoint[];
  rsi: IndicatorPoint[];
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/** Media móvil simple sobre precios de cierre */
export function computeSMA(candles: IndicatorCandle[], period: number): IndicatorPoint[] {
  const out: IndicatorPoint[] = [];
  if (period < 1 || candles.length < period) return out;

  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) sum -= candles[i - period].close;
    if (i >= period - 1) {
      out.push({ time: candles[i].time, value: sum / period });
    }
  }
  return out;
}

/** Bandas de Bollinger (media ± k desviaciones estándar) */
export function computeBollinger(
  candles: IndicatorCandle[],
  period: number,
  stdDevMult: number,
): BollingerPoint[] {
  const out: BollingerPoint[] = [];
  if (period < 1 || candles.length < period) return out;

  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1).map((c) => c.close);
    const middle = slice.reduce((a, b) => a + b, 0) / period;
    const sd = stdDev(slice);
    out.push({
      time: candles[i].time,
      upper: middle + stdDevMult * sd,
      middle,
      lower: middle - stdDevMult * sd,
    });
  }
  return out;
}

/** RSI (Wilder / suavizado exponencial) */
export function computeRSI(candles: IndicatorCandle[], period: number): IndicatorPoint[] {
  const out: IndicatorPoint[] = [];
  if (period < 1 || candles.length <= period) return out;

  const closes = candles.map((c) => c.close);
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) avgGain += change;
    else avgLoss -= change;
  }
  avgGain /= period;
  avgLoss /= period;

  const rsiAt = (g: number, l: number) => {
    if (l === 0) return 100;
    if (g === 0) return 0;
    const rs = g / l;
    return 100 - 100 / (1 + rs);
  };

  out.push({ time: candles[period].time, value: rsiAt(avgGain, avgLoss) });

  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    out.push({ time: candles[i].time, value: rsiAt(avgGain, avgLoss) });
  }

  return out;
}

export function computeAllIndicators(
  candles: IndicatorCandle[],
  config: IndicatorConfig = DEFAULT_INDICATOR_CONFIG,
): IndicatorResult {
  const sorted = [...candles].sort((a, b) => a.time - b.time);
  return {
    sma: computeSMA(sorted, config.smaPeriod),
    bollinger: computeBollinger(sorted, config.bbPeriod, config.bbStdDev),
    rsi: computeRSI(sorted, config.rsiPeriod),
  };
}
