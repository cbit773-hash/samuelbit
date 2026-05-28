import { useState } from 'react';
import { CreditCard, Copy, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { createDepositLinkForClient } from '../../../core/supabase/services/agent-payment.service';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName, formatCrmMoney } from '../shared/crm-utils';

export function AgentQuickPayPanel({ crm }: { crm: ReturnType<typeof useAgentCrm> }) {
  const [amount, setAmount] = useState('250');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lead = crm.currentLead;
  const clientId = lead?.client_user_id;

  const handleGenerate = async () => {
    if (!clientId || !lead) {
      setError('Este lead no tiene cuenta cliente vinculada. Envíalo a /registro primero.');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await createDepositLinkForClient({
      client_id: clientId,
      amount: Number(amount),
      lead_id: lead.id,
      notes: `Cobro rápido agente — ${leadName(lead)}`,
    });
    setLoading(false);
    if ('error' in result) {
      setError(result.error);
      setPaymentUrl(null);
    } else {
      setPaymentUrl(result.paymentUrl);
    }
  };

  const copyLink = () => {
    if (paymentUrl) navigator.clipboard.writeText(paymentUrl);
  };

  const whatsappShare = () => {
    if (!paymentUrl || !lead) return;
    const text = encodeURIComponent(
      `Hola ${lead.first_name}, aquí está tu link de depósito InvestPRO (${formatCrmMoney(Number(amount))}): ${paymentUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-brand mb-6 flex items-center gap-2">
        <CreditCard /> Enlaces de Cobro Rápido
      </h3>
      {lead ? (
        <p className="text-muted text-sm mb-4">
          Lead: <strong className="text-foreground">{leadName(lead)}</strong>
          {clientId ? ' · Cliente vinculado' : ' · Sin cuenta cliente'}
        </p>
      ) : (
        <p className="text-muted text-sm mb-4">Selecciona un lead en Auto-Dialer para generar el link.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-inset border border-border p-6 rounded-xl flex flex-col gap-4">
          <label className="text-muted text-xs font-bold uppercase">Monto USD</label>
          <input
            type="number"
            min={10}
            max={100000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-surface-alt border border-border rounded-lg px-4 py-2 text-foreground"
          />
          <button
            type="button"
            disabled={loading || !lead || crm.isDemo}
            onClick={handleGenerate}
            className="w-full bg-primary text-polar-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Generando…' : 'Generar link NOWPayments'}
          </button>
          {!clientId && lead && (
            <a
              href="/registro"
              className="text-xs text-brand underline text-center"
            >
              Enviar a registro web
            </a>
          )}
          {error && <p className="text-rose-400 text-xs">{error}</p>}
        </div>
        <div className="bg-surface-inset border border-border p-6 rounded-xl flex flex-col gap-3">
          <p className="text-foreground font-bold text-sm">Link generado</p>
          {paymentUrl ? (
            <>
              <p className="text-xs text-muted break-all font-mono bg-surface-alt p-2 rounded">{paymentUrl}</p>
              <div className="flex gap-2">
                <button type="button" onClick={copyLink} className="flex-1 bg-surface-alt border border-border py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1">
                  <Copy size={14} /> Copiar
                </button>
                <button type="button" onClick={whatsappShare} className="flex-1 bg-emerald-600 py-2 rounded-lg text-sm font-bold text-foreground">
                  WhatsApp
                </button>
                <a href={paymentUrl} target="_blank" rel="noreferrer" className="flex-1 bg-cyan-600 py-2 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-1">
                  <ExternalLink size={14} /> Abrir
                </a>
              </div>
            </>
          ) : (
            <p className="text-muted text-sm flex items-center gap-2">
              <LinkIcon size={16} /> El link aparecerá aquí tras generar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
