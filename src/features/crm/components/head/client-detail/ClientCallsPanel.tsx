import type { ClientBundle } from '../../../../../core/supabase/services/staff.service';

interface ClientCallsPanelProps {
  calls: ClientBundle['calls'];
}

export function ClientCallsPanel({ calls }: ClientCallsPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="font-bold mb-3">Llamadas CRM</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {calls.length === 0 && <p className="text-sm text-muted">Sin llamadas registradas.</p>}
        {calls.map((c) => (
          <div key={c.id} className="text-sm border-b border-border/50 pb-2">
            <span className="text-foreground">{c.direction}</span>
            <span className="text-muted"> · {c.status}</span>
            {c.duration_seconds != null && (
              <span className="text-muted"> · {c.duration_seconds}s</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
