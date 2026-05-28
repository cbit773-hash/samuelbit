/// <reference lib="webworker" />
import {
  computeAllIndicators,
  DEFAULT_INDICATOR_CONFIG,
  type IndicatorCandle,
  type IndicatorConfig,
  type IndicatorResult,
} from '../utils/indicators';

export interface IndicatorWorkerRequest {
  id: string;
  candles: IndicatorCandle[];
  config?: Partial<IndicatorConfig>;
}

export interface IndicatorWorkerResponse extends IndicatorResult {
  id: string;
}

self.onmessage = (event: MessageEvent<IndicatorWorkerRequest>) => {
  const { id, candles, config } = event.data;
  const merged: IndicatorConfig = { ...DEFAULT_INDICATOR_CONFIG, ...config };
  const result = computeAllIndicators(candles, merged);
  const payload: IndicatorWorkerResponse = { id, ...result };
  self.postMessage(payload);
};
