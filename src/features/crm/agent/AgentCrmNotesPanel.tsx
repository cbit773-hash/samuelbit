import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import type { LeadStatus } from '../../../core/supabase/database.types';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName, LEAD_STATUSES } from '../shared/crm-utils';

export function AgentCrmNotesPanel({ crm }: { crm: ReturnType<typeof useAgentCrm> }) {
  const [crmStatus, setCrmStatus] = useState<LeadStatus>('En seguimiento');
  const [crmNotes, setCrmNotes] = useState('');

  useEffect(() => {
    if (crm.currentLead) {
      setCrmStatus(crm.currentLead.status);
      setCrmNotes(crm.currentLead.notes ?? '');
    }
  }, [crm.currentLead?.id]);

  const selectLead = (leadId: string) => {
    const idx = crm.dialerQueue.findIndex((l) => l.id === leadId);
    if (idx >= 0) crm.setCurrentIndex(idx);
    const lead = crm.leads.find((l) => l.id === leadId);
    if (lead) {
      setCrmStatus(lead.status);
      setCrmNotes(lead.notes ?? '');
    }
  };

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <FileText /> CRM Rápido (Supabase)
      </h3>
      <div className="bg-surface-inset p-6 rounded-xl border border-border">
        {crm.currentLead ? (
          <>
            <p className="text-foreground font-bold mb-4">Lead: {leadName(crm.currentLead)}</p>
            <select
              value={crmStatus}
              onChange={(e) => setCrmStatus(e.target.value as LeadStatus)}
              className="bg-surface-inset border border-border text-foreground rounded-lg px-4 py-2 w-full md:w-1/2 outline-none focus:border-cyan-500 mb-4"
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <textarea
              value={crmNotes}
              onChange={(e) => setCrmNotes(e.target.value)}
              className="w-full bg-surface-inset border border-border rounded-lg p-4 text-foreground h-32 outline-none focus:border-cyan-500 resize-none"
              placeholder="Detalles de la llamada…"
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                disabled={crm.saving}
                onClick={async () => {
                  await crm.applyLeadUpdate(crm.currentLead!.id, crmStatus, crmNotes);
                }}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-foreground font-bold px-6 py-2 rounded-lg"
              >
                {crm.saving ? 'Guardando…' : 'Guardar y Pasar al Siguiente'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-muted">Selecciona un lead desde Auto-Dialer o la lista de leads.</p>
        )}
      </div>
      {crm.sortedLeads.length > 0 && (
        <div className="mt-6 max-h-48 overflow-y-auto space-y-1">
          {crm.sortedLeads.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => selectLead(l.id)}
              className="w-full text-left bg-surface-inset hover:bg-surface-alt p-2 rounded text-sm flex justify-between"
            >
              <span className="text-foreground">{leadName(l)}</span>
              <span className="text-muted">{l.status}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
