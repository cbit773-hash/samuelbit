import { useEffect, useState, useCallback } from 'react';
import { AlertOctagon, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../../../core/supabase/client';
import { ackSos, getOpenSosAlerts } from '../../../core/supabase/services/agent-closer.service';
import type { SosAlert } from '../../../core/supabase/database.types';
import { useAuthStore } from '../../auth/store/auth.store';

export function SosInboxPanel() {
  const user = useAuthStore((s) => s.user);
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let tid: string | null = null;
    if (user?.id) {
      const { data } = await supabase.from('profiles').select('team_id').eq('id', user.id).single();
      tid = data?.team_id ?? null;
      setTeamId(tid);
    }
    setAlerts(await getOpenSosAlerts(tid));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel('sos-alerts-inbox')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sos_alerts' },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const handleAck = async (id: string) => {
    await ackSos(id);
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-rose-500" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.length === 0 && (
        <p className="text-muted text-sm text-center py-8">No hay alertas SOS activas.</p>
      )}
      {alerts.map((a) => (
        <div
          key={a.id}
          className="bg-rose-500/10 p-5 rounded-xl border border-rose-500/30 flex justify-between items-center gap-4"
        >
          <div>
            <p className="font-bold text-foreground text-lg flex items-center gap-2">
              <AlertOctagon className="text-rose-500 animate-pulse" size={20} />
              Agente · {a.agent_id.slice(0, 8)}
            </p>
            <p className="text-sm text-rose-400 mt-1">{a.message ?? 'Sin mensaje'}</p>
            <p className="text-xs text-muted mt-2 font-mono">
              {new Date(a.created_at).toLocaleString()}
              {teamId ? '' : ' · Mesa global'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAck(a.id)}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-polar-white rounded-xl font-black text-sm flex items-center gap-2 shrink-0"
          >
            <Zap size={18} /> Tomar alerta
          </button>
        </div>
      ))}
    </div>
  );
}
