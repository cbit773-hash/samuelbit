import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '../../../core/supabase/client';
import { getUnassignedLeads, reassignLead } from '../../../core/supabase/services/leads.service';
import { getTeamMembers } from '../../../core/supabase/services/teams.service';
import { getProfilesByRole } from '../../../core/supabase/services/profiles.service';
import { useAuthStore } from '../../auth/store/auth.store';
import type { Lead, Profile } from '../../../core/supabase/database.types';
import { leadName } from '../shared/crm-utils';

export function LeadAssignmentBoard({ teamOnly = true }: { teamOnly?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const [unassigned, setUnassigned] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const pool = await getUnassignedLeads();
    let profileRow: { team_id: string | null } | null = null;
    if (user?.id) {
      const { data } = await supabase.from('profiles').select('team_id').eq('id', user.id).single();
      profileRow = data;
    }

    let agentList: Profile[] = [];
    if (teamOnly && profileRow?.team_id) {
      agentList = (await getTeamMembers(profileRow.team_id)).filter((p) => p.role === 'AGENT');
    } else if (!teamOnly) {
      agentList = await getProfilesByRole('AGENT');
    }

    setUnassigned(pool);
    setAgents(agentList);
    setLoading(false);
  }, [user?.id, teamOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAssign = async (leadId: string, agentId: string) => {
    if (!agentId) return;
    setAssigning(leadId);
    await reassignLead(leadId, agentId);
    await load();
    setAssigning(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-purple-500" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={load}
        className="text-xs text-muted hover:text-foreground flex items-center gap-1 mb-2"
      >
        <RefreshCw size={12} /> Actualizar pool
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-inset p-5 rounded-xl border border-border">
          <p className="font-bold text-purple-400 mb-4 border-b border-border pb-2">
            Pool libre ({unassigned.length})
          </p>
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {unassigned.length === 0 && (
              <p className="text-muted text-sm">No hay leads sin asignar.</p>
            )}
            {unassigned.map((l) => (
              <div
                key={l.id}
                className="bg-surface-alt p-3 rounded border border-border flex flex-col sm:flex-row sm:items-center gap-2 justify-between"
              >
                <div>
                  <span className="text-foreground text-sm font-bold">{leadName(l)}</span>
                  <p className="text-muted text-xs font-mono">{l.phone} · {l.country}</p>
                </div>
                <select
                  disabled={assigning === l.id}
                  defaultValue=""
                  onChange={(e) => handleAssign(l.id, e.target.value)}
                  className="bg-surface-inset border border-border text-foreground rounded px-2 py-1 text-xs min-w-[140px]"
                >
                  <option value="">Asignar a…</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.full_name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface-inset p-5 rounded-xl border border-border">
          <p className="font-bold text-emerald-400 mb-4 border-b border-border pb-2">
            Agentes {teamOnly ? 'de tu mesa' : ''}
          </p>
          {agents.length === 0 ? (
            <p className="text-muted text-sm">Sin agentes en el equipo.</p>
          ) : (
            agents.map((a) => (
              <div key={a.id} className="flex justify-between py-2 border-b border-border text-sm">
                <span className="text-foreground font-bold">{a.full_name}</span>
                <span className="text-xs text-muted">{a.work_status ?? 'offline'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
