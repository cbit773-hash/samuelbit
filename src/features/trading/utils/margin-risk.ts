export type MarginRiskState = 'healthy' | 'alert' | 'margin_call' | 'stop_out';

export const MARGIN_ALERT_THRESHOLD = 100;
export const MARGIN_STOP_OUT_THRESHOLD = 50;

export function getMarginRiskState(marginLevel: number): MarginRiskState {
  if (marginLevel <= MARGIN_STOP_OUT_THRESHOLD) return 'stop_out';
  if (marginLevel < MARGIN_ALERT_THRESHOLD) return 'margin_call';
  if (marginLevel < 200) return 'alert';
  return 'healthy';
}

export function shouldBlockNewOrders(marginLevel: number): boolean {
  return marginLevel < MARGIN_ALERT_THRESHOLD;
}

export function shouldTriggerStopOut(marginLevel: number): boolean {
  return marginLevel <= MARGIN_STOP_OUT_THRESHOLD;
}
