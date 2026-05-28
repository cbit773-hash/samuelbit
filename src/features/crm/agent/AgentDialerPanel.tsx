import { useEffect, useState } from 'react';
import { Phone, CheckCircle, Calendar, PhoneCall, PhoneOff, Loader2, AlertCircle } from 'lucide-react';
import { useTwilioDialer } from '../hooks/useTwilioDialer';
import { getMyCallLogs } from '../../../core/supabase/services/calls.service';
import { setMyWorkStatus } from '../../../core/supabase/services/agent-closer.service';
import type { CallLog } from '../../../core/supabase/database.types';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName } from '../shared/crm-utils';
import { AgentQueueSidebar } from './AgentQueueSidebar';

type Crm = ReturnType<typeof useAgentCrm>;

const PHASE_LABELS: Record<string, string> = {
  idle: 'Inicializando…',
  initializing: 'Conectando VoIP…',
  ready: 'Listo para llamar',
  connecting: 'Marcando…',
  in_call: 'En llamada',
  error: 'Error VoIP',
};

export function AgentDialerPanel({ crm }: { crm: Crm }) {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const dialer = useTwilioDialer({
    enabled: !crm.isDemo,
    onDisconnected: () => {
      setMyWorkStatus('wrap_up').catch(() => {});
    },
  });

  useEffect(() => {
    if (!crm.isDemo) {
      getMyCallLogs(8).then(setCallLogs);
    }
  }, [crm.isDemo, crm.currentLead?.id]);

  useEffect(() => {
    if (dialer.phase === 'in_call') setMyWorkStatus('in_call').catch(() => {});
    if (dialer.phase === 'ready') setMyWorkStatus('ready').catch(() => {});
  }, [dialer.phase]);

  const handleCall = () => {
    if (crm.currentLead) dialer.callLead(crm.currentLead);
  };

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in flex flex-col md:flex-row gap-8">
      <div className="flex-1 bg-surface-inset border border-cyan-500/20 rounded-2xl p-8 text-center flex flex-col justify-center items-center relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full" />
        <div className="relative z-10 mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            dialer.phase === 'ready' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
            dialer.phase === 'in_call' || dialer.phase === 'connecting' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' :
            dialer.phase === 'error' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
            'bg-surface-alt text-muted border-border'
          }`}>
            {PHASE_LABELS[dialer.phase] ?? dialer.phase}
          </span>
          {dialer.isInCall && (
            <span className="text-xs font-mono text-cyan-400">{Math.floor(dialer.callDurationSec / 60)}:{String(dialer.callDurationSec % 60).padStart(2, '0')}</span>
          )}
        </div>
        {dialer.error && (
          <p className="text-rose-400 text-xs mb-4 relative z-10 flex items-center gap-1">
            <AlertCircle size={14} /> {dialer.error}
            {!crm.isDemo && (
              <button type="button" onClick={dialer.retryInit} className="underline ml-2">Reintentar</button>
            )}
          </p>
        )}
        {crm.isDemo && (
          <p className="text-brand text-xs mb-4 relative z-10">VoIP deshabilitado en modo demo. Usa acciones de estado manual.</p>
        )}
        {crm.currentLead ? (
          <>
            <p className="text-cyan-400 text-sm font-bold tracking-widest mb-4 relative z-10">
              LEAD ACTUAL · {crm.currentLead.status}
            </p>
            <p className="text-5xl font-mono text-foreground font-black tracking-widest relative z-10 mb-4">
              {crm.currentLead.phone ?? 'Sin teléfono'}
            </p>
            <div className="bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30 relative z-10 mb-6">
              <p className="text-cyan-500 font-bold text-xl">{leadName(crm.currentLead)}</p>
              <p className="text-muted text-sm mt-1">
                {crm.currentLead.country} · {crm.currentLead.interest ?? 'Interés N/D'}
                {crm.currentLead.email ? ` · ${crm.currentLead.email}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center relative z-10 mb-4">
              {!crm.isDemo && (
                <>
                  {dialer.isInCall ? (
                    <button
                      type="button"
                      onClick={dialer.hangUp}
                      className="bg-rose-600 hover:bg-rose-500 text-foreground px-6 py-3 rounded-full font-black flex items-center gap-2"
                    >
                      <PhoneOff size={20} /> Colgar
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!dialer.isReady || dialer.phase === 'initializing'}
                      onClick={handleCall}
                      className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-foreground px-8 py-4 rounded-full font-black flex items-center gap-2"
                    >
                      {dialer.phase === 'initializing' ? <Loader2 size={20} className="animate-spin" /> : <PhoneCall size={20} />}
                      Llamar
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                disabled={crm.saving}
                onClick={() => crm.applyLeadUpdate(crm.currentLead!.id, 'No contesta')}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-foreground p-4 rounded-full"
                title="No contesta"
              >
                <Phone size={24} className="rotate-[135deg]" />
              </button>
              <button
                type="button"
                disabled={crm.saving}
                onClick={() => crm.applyLeadUpdate(crm.currentLead!.id, 'En seguimiento', `${crm.currentLead!.notes ?? ''}\nCallback programado`.trim())}
                className="bg-accent-lime/500 hover:bg-primary-hover disabled:opacity-50 text-black p-4 rounded-full"
                title="Callback"
              >
                <Calendar size={24} />
              </button>
              <button
                type="button"
                disabled={crm.saving}
                onClick={() => crm.applyLeadUpdate(crm.currentLead!.id, 'Cerrado (FTD)')}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-foreground p-4 rounded-full"
                title="FTD"
              >
                <CheckCircle size={24} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-muted relative z-10">
            {crm.loading ? 'Cargando cola…' : 'No hay leads activos en tu cola. Revisa callbacks o pide asignaciones al Team Leader.'}
          </p>
        )}
        {callLogs.length > 0 && (
          <div className="w-full mt-6 relative z-10 text-left">
            <p className="text-muted text-xs font-bold uppercase mb-2">Últimas llamadas</p>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {callLogs.map((c) => (
                <div key={c.id} className="text-xs flex justify-between bg-surface-alt/80 px-2 py-1 rounded">
                  <span className="text-foreground">{c.to_number ?? '—'}</span>
                  <span className="text-muted">{c.status} · {c.duration_seconds ?? 0}s</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AgentQueueSidebar crm={crm} />
    </div>
  );
}
