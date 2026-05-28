import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { scheduleCallback } from '../../../core/supabase/services/agent-closer.service';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName } from '../shared/crm-utils';

export function AgentCallbacksPanel({
  crm,
  onGoDialer,
}: {
  crm: ReturnType<typeof useAgentCrm>;
  onGoDialer: (leadId: string) => void;
}) {
  const [schedLeadId, setSchedLeadId] = useState('');
  const [schedAt, setSchedAt] = useState('');
  const [schedReason, setSchedReason] = useState('');
  const [saving, setSaving] = useState(false);

  const leadById = (id: string) => crm.leads.find((l) => l.id === id);

  const handleSchedule = async () => {
    if (!schedLeadId || !schedAt) return;
    setSaving(true);
    await scheduleCallback(schedLeadId, new Date(schedAt).toISOString(), schedReason || undefined);
    await crm.refresh();
    setSaving(false);
    setSchedAt('');
    setSchedReason('');
  };

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-brand mb-6 flex items-center gap-2">
        <Calendar /> Agenda de Seguimientos
      </h3>

      <div className="bg-surface-inset border border-border p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={schedLeadId}
          onChange={(e) => setSchedLeadId(e.target.value)}
          className="bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm text-foreground"
        >
          <option value="">Lead…</option>
          {crm.leads.map((l) => (
            <option key={l.id} value={l.id}>{leadName(l)}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={schedAt}
          onChange={(e) => setSchedAt(e.target.value)}
          className="bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm text-foreground"
        />
        <input
          value={schedReason}
          onChange={(e) => setSchedReason(e.target.value)}
          placeholder="Motivo"
          className="bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm text-foreground"
        />
        <button
          type="button"
          disabled={saving || !schedLeadId || !schedAt}
          onClick={handleSchedule}
          className="bg-primary text-polar-white font-bold rounded-lg text-sm disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Programar'}
        </button>
      </div>

      <div className="space-y-4">
        {crm.scheduledCallbacks.length === 0 && crm.callbackLeads.length === 0 && (
          <p className="text-muted text-sm">No hay callbacks pendientes.</p>
        )}
        {crm.scheduledCallbacks.map((cb) => {
          const lead = leadById(cb.lead_id);
          return (
            <div
              key={cb.id}
              className="bg-surface-inset border border-l-4 border-l-amber-500 border-border p-4 rounded-xl flex justify-between items-center gap-4"
            >
              <div>
                <p className="text-foreground font-bold">{lead ? leadName(lead) : cb.lead_id.slice(0, 8)}</p>
                <p className="text-muted text-sm flex items-center gap-1 mt-1">
                  <Clock size={12} /> {new Date(cb.scheduled_at).toLocaleString()}
                </p>
                {cb.reason && <p className="text-muted text-xs mt-1">{cb.reason}</p>}
              </div>
              {lead && (
                <button
                  type="button"
                  onClick={() => onGoDialer(lead.id)}
                  className="bg-primary text-polar-white px-4 py-2 rounded-lg font-bold shrink-0"
                >
                  Llamar
                </button>
              )}
            </div>
          );
        })}
        {crm.callbackLeads
          .filter((l) => !crm.scheduledCallbacks.some((c) => c.lead_id === l.id))
          .map((lead) => (
            <div
              key={lead.id}
              className="bg-surface-inset border border-l-4 border-l-blue-500 border-border p-4 rounded-xl flex justify-between items-center gap-4"
            >
              <div>
                <p className="text-foreground font-bold text-lg">{leadName(lead)} · {lead.status}</p>
                <p className="text-muted text-sm mt-1">{lead.phone}</p>
                {lead.notes && <p className="text-muted text-xs mt-2">{lead.notes}</p>}
              </div>
              <button
                type="button"
                onClick={() => onGoDialer(lead.id)}
                className="bg-primary text-polar-white px-4 py-2 rounded-lg font-bold shrink-0"
              >
                Llamar
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
