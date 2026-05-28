import { useCallback, useEffect, useRef, useState } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import { fetchVoiceToken } from '../../../core/twilio/twilio-voice.service';
import { normalizeToE164 } from '../../../shared/utils/phone';
import type { Lead } from '../../../core/supabase/database.types';

export type DialerPhase = 'idle' | 'initializing' | 'ready' | 'connecting' | 'in_call' | 'error';

interface UseTwilioDialerOptions {
  enabled?: boolean;
  onDisconnected?: () => void;
}

export function useTwilioDialer(options: UseTwilioDialerOptions = {}) {
  const { enabled = true, onDisconnected } = options;
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [phase, setPhase] = useState<DialerPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [callDurationSec, setCallDurationSec] = useState(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setCallDurationSec(0);
    timerRef.current = setInterval(() => {
      setCallDurationSec((s) => s + 1);
    }, 1000);
  }, [clearTimer]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    const result = await fetchVoiceToken();
    if ('error' in result) {
      setError(result.error);
      setPhase('error');
      return null;
    }
    return result.token;
  }, []);

  const initDevice = useCallback(async () => {
    if (!enabled) return;
    setPhase('initializing');
    setError(null);

    const token = await refreshToken();
    if (!token) return;

    try {
      if (deviceRef.current) {
        deviceRef.current.destroy();
        deviceRef.current = null;
      }

      const device = new Device(token, { logLevel: 1 });

      device.on('registered', () => {
        setPhase('ready');
        setError(null);
      });

      device.on('error', (err) => {
        console.error('[Twilio Device]', err);
        setError(err.message || 'Error del dispositivo de voz');
        setPhase('error');
      });

      device.on('tokenWillExpire', async () => {
        const newToken = await refreshToken();
        if (newToken && deviceRef.current) {
          deviceRef.current.updateToken(newToken);
        }
      });

      device.on('unregistered', () => {
        setPhase((p) => (p === 'in_call' || p === 'connecting' ? p : 'idle'));
      });

      await device.register();
      deviceRef.current = device;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudo inicializar el dialer';
      setError(msg);
      setPhase('error');
    }
  }, [enabled, refreshToken]);

  useEffect(() => {
    if (enabled) {
      initDevice();
    }
    return () => {
      clearTimer();
      callRef.current?.disconnect();
      callRef.current = null;
      deviceRef.current?.destroy();
      deviceRef.current = null;
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps -- init once when enabled

  const hangUp = useCallback(() => {
    callRef.current?.disconnect();
    callRef.current = null;
    clearTimer();
    setPhase(deviceRef.current ? 'ready' : 'idle');
  }, [clearTimer]);

  const callLead = useCallback(
    async (lead: Lead) => {
      const to = normalizeToE164(lead.phone, lead.country);
      if (!to) {
        setError('Teléfono del lead inválido o incompleto');
        return;
      }

      const device = deviceRef.current;
      if (!device) {
        setError('Dialer no listo. Espera unos segundos o recarga.');
        return;
      }

      if (phase === 'connecting' || phase === 'in_call') {
        return;
      }

      setPhase('connecting');
      setError(null);

      try {
        const call = await device.connect({
          params: {
            To: to,
            LeadId: lead.id,
          },
        });

        callRef.current = call;

        call.on('accept', () => {
          setPhase('in_call');
          startTimer();
        });

        call.on('disconnect', () => {
          callRef.current = null;
          clearTimer();
          setPhase(deviceRef.current ? 'ready' : 'idle');
          onDisconnected?.();
        });

        call.on('cancel', () => {
          callRef.current = null;
          clearTimer();
          setPhase('ready');
        });

        call.on('error', (err) => {
          console.error('[Twilio Call]', err);
          setError(err.message || 'Error en la llamada');
          setPhase('ready');
          clearTimer();
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'No se pudo iniciar la llamada';
        setError(msg);
        setPhase('ready');
      }
    },
    [phase, startTimer, clearTimer, onDisconnected],
  );

  const retryInit = useCallback(() => {
    initDevice();
  }, [initDevice]);

  return {
    phase,
    error,
    callDurationSec,
    isReady: phase === 'ready',
    isInCall: phase === 'in_call' || phase === 'connecting',
    callLead,
    hangUp,
    retryInit,
    normalizeToE164,
  };
}
