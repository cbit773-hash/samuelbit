import { useCallback, useEffect, useRef } from 'react';
import type { IndicatorCandle, IndicatorConfig, IndicatorResult } from '../utils/indicators';
import { DEFAULT_INDICATOR_CONFIG } from '../utils/indicators';
import type { IndicatorWorkerRequest, IndicatorWorkerResponse } from '../workers/indicators.worker';

export function useIndicatorWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<
    Map<string, { resolve: (r: IndicatorResult) => void; reject: (e: Error) => void }>
  >(new Map());

  useEffect(() => {
    const worker = new Worker(new URL('../workers/indicators.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<IndicatorWorkerResponse>) => {
      const { id, sma, bollinger, rsi } = event.data;
      const pending = pendingRef.current.get(id);
      if (pending) {
        pending.resolve({ sma, bollinger, rsi });
        pendingRef.current.delete(id);
      }
    };

    worker.onerror = () => {
      pendingRef.current.forEach(({ reject }) => reject(new Error('Indicator worker failed')));
      pendingRef.current.clear();
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
      pendingRef.current.clear();
    };
  }, []);

  const computeIndicators = useCallback(
    (candles: IndicatorCandle[], config?: Partial<IndicatorConfig>): Promise<IndicatorResult> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Indicator worker not ready'));
          return;
        }
        if (candles.length < DEFAULT_INDICATOR_CONFIG.smaPeriod) {
          resolve({ sma: [], bollinger: [], rsi: [] });
          return;
        }

        const id = crypto.randomUUID();
        pendingRef.current.set(id, { resolve, reject });

        const payload: IndicatorWorkerRequest = { id, candles, config };
        workerRef.current.postMessage(payload);
      });
    },
    [],
  );

  return { computeIndicators };
}
