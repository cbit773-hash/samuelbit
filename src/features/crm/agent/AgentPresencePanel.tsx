import { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';
import { setMyWorkStatus } from '../../../core/supabase/services/agent-closer.service';
import type { AgentPresence } from '../../../core/supabase/database.types';
import { supabase } from '../../../core/supabase/client';

const STATUSES: { id: AgentPresence; label: string; className: string }[] = [
  { id: 'ready', label: 'Disponible', className: 'bg-emerald-600/20 text-emerald-500 border-emerald-500/50' },
  { id: 'break', label: 'Break', className: 'bg-orange-600 text-foreground' },
  { id: 'restroom', label: 'Baño', className: 'bg-surface-inset border border-border text-muted' },
  { id: 'wrap_up', label: 'Wrap-up', className: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/50' },
  { id: 'offline', label: 'Offline', className: 'bg-surface-inset border border-border text-muted' },
];

export function AgentPresencePanel() {
  const [current, setCurrent] = useState<AgentPresence>('offline');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('work_status')
        .eq('id', user.id)
        .single();
      if (data?.work_status) setCurrent(data.work_status as AgentPresence);
    });
  }, []);

  const update = async (status: AgentPresence) => {
    setSaving(true);
    const ok = await setMyWorkStatus(status);
    if (ok) setCurrent(status);
    setSaving(false);
  };

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in text-center">
      <h3 className="text-xl font-bold text-orange-500 mb-6 flex items-center justify-center gap-2">
        <Coffee /> Control de Presencia
      </h3>
      <p className="text-muted mb-2 text-sm">Estado actual: <strong className="text-foreground">{current}</strong></p>
      <p className="text-muted mb-8 max-w-md mx-auto text-xs">
        El Floor Manager ve tu estado en el monitor de mesa. En llamada se actualiza automáticamente con VoIP.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={saving}
            onClick={() => update(s.id)}
            className={`px-6 py-4 rounded-xl font-black border disabled:opacity-50 ${
              current === s.id ? s.className + ' ring-2 ring-cyan-500/50' : s.className
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
