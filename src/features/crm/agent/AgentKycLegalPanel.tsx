import { useState } from 'react';
import { Shield, Copy, CheckCircle } from 'lucide-react';
import type { useAgentCrm } from '../hooks/useAgentCrm';
import { leadName } from '../shared/crm-utils';
import { CLIENT_PATHS } from '../../../shared/routing/paths';

const LEGAL_LINKS = [
  { label: 'Términos y condiciones', path: '/legal/terminos' },
  { label: 'Política de privacidad', path: '/legal/privacidad' },
  { label: 'Advertencia de riesgos', path: '/legal/riesgos' },
  { label: 'KYC / AML', path: '/legal/kyc-aml' },
];

export function AgentKycLegalPanel({ crm }: { crm: ReturnType<typeof useAgentCrm> }) {
  const [copied, setCopied] = useState<string | null>(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const copyUrl = (path: string) => {
    const url = `${origin}${path}`;
    navigator.clipboard.writeText(url);
    setCopied(path);
    setTimeout(() => setCopied(null), 2000);
  };

  const mailLegal = (path: string, label: string) => {
    const lead = crm.currentLead;
    const to = lead?.email ?? '';
    const url = `${origin}${path}`;
    const subject = encodeURIComponent(`InvestPRO — ${label}`);
    const body = encodeURIComponent(
      `Hola ${lead ? lead.first_name : ''},\n\nTe comparto el documento oficial de InvestPRO:\n${url}\n\nSaludos.`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const kycLink = crm.currentLead?.client_user_id
    ? `${origin}${CLIENT_PATHS.accountTab('seguridad')}`
    : null;

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-indigo-500 mb-6 flex items-center gap-2">
        <Shield /> Documentación Legal & KYC
      </h3>
      {crm.currentLead && (
        <p className="text-muted text-sm mb-4">Lead: {leadName(crm.currentLead)} · {crm.currentLead.email ?? 'sin email'}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {LEGAL_LINKS.map((doc) => (
          <div key={doc.path} className="bg-surface-inset border border-border p-4 rounded-xl flex justify-between items-center gap-2">
            <span className="text-foreground font-bold text-sm">{doc.label}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copyUrl(doc.path)}
                className="text-xs bg-white/10 px-3 py-1 rounded text-foreground flex items-center gap-1"
              >
                {copied === doc.path ? <CheckCircle size={12} /> : <Copy size={12} />}
                Copiar
              </button>
              <button
                type="button"
                onClick={() => mailLegal(doc.path, doc.label)}
                className="text-xs bg-indigo-600 px-3 py-1 rounded text-foreground"
              >
                Email
              </button>
            </div>
          </div>
        ))}
      </div>
      {kycLink && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl">
          <p className="text-foreground font-bold text-sm mb-2">Verificación KYC del cliente</p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(kycLink);
              setCopied('kyc');
            }}
            className="text-xs bg-indigo-600 px-4 py-2 rounded-lg text-foreground font-bold"
          >
            {copied === 'kyc' ? 'Copiado' : 'Copiar link panel KYC'}
          </button>
        </div>
      )}
    </div>
  );
}
