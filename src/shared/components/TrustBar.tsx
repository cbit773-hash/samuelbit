import { Link } from 'react-router-dom';
import { Building2, Shield } from 'lucide-react';
import { PERU_COMPANY } from '../constants/peru-company';

export function TrustBar({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-xs text-muted ${
        compact ? 'gap-2' : 'gap-4'
      }`}
    >
      <span className="inline-flex items-center gap-1.5">
        <Building2 size={14} className="text-primary shrink-0" />
        <span>
          {PERU_COMPANY.legalName} · RUC {PERU_COMPANY.ruc}
        </span>
      </span>
      <span className="hidden sm:inline text-border">|</span>
      <span className="inline-flex items-center gap-1.5">
        <Shield size={14} className="text-rose-400 shrink-0" />
        <Link to="/legal/riesgos" className="hover:text-primary transition-colors">
          Riesgos CFD · SMV
        </Link>
      </span>
    </div>
  );
}
