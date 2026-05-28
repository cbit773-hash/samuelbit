import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { getTeamLeaderboard } from '../../../core/supabase/services/agent-closer.service';
import type { TeamLeaderboardRow } from '../../../core/supabase/database.types';
import { useAuthStore } from '../../auth/store/auth.store';
import { formatCrmMoney } from '../shared/crm-utils';

export function AgentRankingPanel() {
  const userId = useAuthStore((s) => s.user?.id);
  const [rows, setRows] = useState<TeamLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeamLeaderboard(30).then((r) => {
      setRows(r);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
        <Trophy /> Ranking de tu mesa (30 días)
      </h3>
      {loading ? (
        <p className="text-muted text-sm">Cargando ranking…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted text-sm">Sin datos de mesa o sin equipo asignado.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-xs text-muted uppercase border-b border-border">
            <tr>
              <th className="py-2 text-left">#</th>
              <th className="py-2 text-left">Agente</th>
              <th className="py-2 text-right">FTDs</th>
              <th className="py-2 text-right">Volumen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.agent_id}
                className={`border-b border-border ${r.agent_id === userId ? 'bg-yellow-500/10' : ''}`}
              >
                <td className="py-3 font-black text-yellow-400">{r.rank_pos}</td>
                <td className="py-3 font-bold text-foreground">
                  {r.full_name}
                  {r.agent_id === userId && <span className="text-xs text-yellow-500 ml-2">(Tú)</span>}
                </td>
                <td className="py-3 text-right text-emerald-400 font-mono">{r.ftd_count}</td>
                <td className="py-3 text-right text-muted font-mono">{formatCrmMoney(Number(r.approved_volume))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
