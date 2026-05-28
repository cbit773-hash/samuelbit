import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../../core/supabase/client';
import { getTeamPresence } from '../../../core/supabase/services/agent-closer.service';
import { useAuthStore } from '../../auth/store/auth.store';

const STATUS_LABEL: Record<string, string> = {
  ready: 'Disponible',
  in_call: 'En llamada',
  wrap_up: 'Wrap-up',
  break: 'Break',
  restroom: 'Baño',
  offline: 'Offline',
};

const STATUS_COLOR: Record<string, string> = {
  in_call: 'text-emerald-500',
  ready: 'text-brand',
  break: 'text-red-500',
  restroom: 'text-orange-400',
  wrap_up: 'text-cyan-400',
  offline: 'text-muted',
};

export function TeamMonitorPanel() {
  const user = useAuthStore((s) => s.user);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getTeamPresence>>>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data: prof } = await supabase.from('profiles').select('team_id').eq('id', user.id).single();
    if (prof?.team_id) {
      setRows(await getTeamPresence(prof.team_id));
    } else {
      setRows([]);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel('team-presence')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-emerald-500" size={28} />
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-muted bg-surface-inset uppercase border-b border-border">
        <tr>
          <th className="py-3 px-4">Agente</th>
          <th className="py-3 px-4">Estado</th>
          <th className="py-3 px-4">Desde</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((ag) => {
          const st = (ag.work_status as string) ?? 'offline';
          return (
            <tr key={ag.id} className="border-b border-border hover:bg-surface-inset">
              <td className="py-4 px-4 font-bold text-foreground">{ag.full_name}</td>
              <td className={`py-4 px-4 font-bold ${STATUS_COLOR[st] ?? 'text-muted'} flex items-center gap-2`}>
                {st === 'in_call' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                {STATUS_LABEL[st] ?? st}
              </td>
              <td className="py-4 px-4 font-mono text-muted text-xs">
                {ag.work_status_since ? new Date(ag.work_status_since).toLocaleTimeString() : '—'}
              </td>
            </tr>
          );
        })}
        {rows.length === 0 && (
          <tr>
            <td colSpan={3} className="py-8 text-center text-muted text-sm">
              Sin agentes en la mesa o sin equipo asignado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
