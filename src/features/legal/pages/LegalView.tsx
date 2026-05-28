import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  FileText,
  UserCheck,
  Lock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { LEGAL_DASHBOARD_PILLARS } from '../constants/legal-documents';

const PILLAR_ICONS = {
  'Términos y Condiciones': FileText,
  'Regulación Internacional': Scale,
  'KYC / AML': UserCheck,
  'Protección de Datos (GDPR)': Lock,
} as const;

export function LegalView() {
  return (
    <div className="flex flex-col h-full gap-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-primary font-bold mb-2">
            <ShieldCheck size={20} /> InvestPRO LEGAL
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Centro de Cumplimiento y Seguridad
          </h1>
          <p className="text-muted mt-2">
            Transparencia absoluta. Revisa el estado legal y regulatorio de tu cuenta y de la plataforma.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEGAL_DASHBOARD_PILLARS.map((pillar) => {
          const Icon = PILLAR_ICONS[pillar.title as keyof typeof PILLAR_ICONS];
          return (
            <div
              key={pillar.path}
              className="bg-surface-alt border border-border rounded-2xl p-8 hover:border-primary/30 transition-all group shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={64} className="text-primary" />
              </div>

              <Icon size={32} className="text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">{pillar.title}</h2>
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold mb-4">
                <CheckCircle2 size={14} /> {pillar.status}
              </div>
              <p className="text-muted leading-relaxed text-sm">{pillar.description}</p>

              <Link
                to={pillar.path}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 text-sm font-semibold text-primary hover:text-brand inline-flex items-center gap-1.5 group-hover:underline"
              >
                Ver documento completo
                <ExternalLink size={14} aria-hidden />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="bg-background border border-border rounded-2xl p-8 mt-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-surface-alt p-4 rounded-full">
            <ShieldCheck size={40} className="text-muted" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Auditorías de Seguridad Continuas</h3>
            <p className="text-muted text-sm mt-1">
              Los contratos inteligentes de InvestPRO y su infraestructura son auditados trimestralmente.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="bg-white/10 hover:bg-surface-inset text-foreground px-6 py-3 rounded-lg font-semibold transition-colors shrink-0"
        >
          Descargar Reporte (Q1 2026)
        </button>
      </div>
    </div>
  );
}
