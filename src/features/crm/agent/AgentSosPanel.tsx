import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { raiseSos } from '../../../core/supabase/services/agent-closer.service';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName } from '../shared/crm-utils';

export function AgentSosPanel({ crm }: { crm: ReturnType<typeof useAgentCrm> }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSos = async () => {
    setLoading(true);
    setError(null);
    const id = await raiseSos(crm.currentLead?.id, message || 'Cliente VIP en riesgo — necesito take-over');
    setLoading(false);
    if (id) {
      setSent(true);
      setTimeout(() => setSent(false), 8000);
    } else {
      setError('No se pudo enviar la alerta. Verifica migración agent_closer_ops.');
    }
  };

  return (
    <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-10 text-center shadow-xl animate-fade-in">
      <AlertTriangle size={64} className="text-rose-500 mx-auto mb-6 animate-bounce" />
      <h3 className="text-3xl font-black text-rose-500 mb-4">¿El cliente se está cayendo?</h3>
      <p className="text-rose-300 max-w-lg mx-auto mb-4">
        Tu Floor Manager y Team Leader recibirán la alerta en tiempo real.
      </p>
      {crm.currentLead && (
        <p className="text-foreground text-sm mb-4">Lead: {leadName(crm.currentLead)} · {crm.currentLead.phone}</p>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe la situación (opcional)…"
        className="w-full max-w-md mx-auto bg-surface-inset border border-rose-500/30 rounded-lg p-3 text-foreground text-sm mb-6 h-20 resize-none"
      />
      {error && <p className="text-rose-400 text-sm mb-4">{error}</p>}
      {sent ? (
        <p className="text-emerald-400 font-bold flex items-center justify-center gap-2">
          <CheckCircle size={20} /> SOS enviado — supervisor notificado
        </p>
      ) : (
        <button
          type="button"
          disabled={loading || crm.isDemo}
          onClick={handleSos}
          className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-polar-white text-2xl font-black px-12 py-6 rounded-full"
        >
          {loading ? 'Enviando…' : 'ACTIVAR SOS (AYUDA EN VIVO)'}
        </button>
      )}
    </div>
  );
}
