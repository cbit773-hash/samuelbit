import { Shield } from 'lucide-react';
import type { KycStatus } from '../../../core/supabase/database.types';
import { KYC_STATUS_LABELS, KYC_STATUS_COLORS } from '../../../core/supabase/services/kyc.service';

interface InvestProMemberCardProps {
  fullName: string;
  clientId: string;
  kycStatus?: KycStatus;
}

export function InvestProMemberCard({ fullName, clientId, kycStatus = 'none' }: InvestProMemberCardProps) {
  const shortId = clientId.slice(0, 8).toUpperCase();

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1117] via-[#151b24] to-[#0a2540] p-6 shadow-[0_20px_50px_-12px_rgba(0,108,255,0.35)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-3xl rounded-full pointer-events-none" />
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold">InvestPRO</p>
          <p className="text-xs text-white/40 mt-0.5">Cuenta Inversor</p>
        </div>
        <div className="w-10 h-8 rounded bg-gradient-to-br from-amber-300/80 to-amber-600/60 border border-white/20" aria-hidden />
      </div>
      <p className="font-mono text-lg text-white tracking-widest mb-1 truncate">{fullName || 'Inversor'}</p>
      <p className="font-mono text-xs text-white/50 mb-6">ID · {shortId}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold flex items-center gap-1.5 ${KYC_STATUS_COLORS[kycStatus]}`}>
          <Shield size={14} />
          {KYC_STATUS_LABELS[kycStatus]}
        </span>
        <span className="text-[10px] text-white/30 uppercase">USD Wallet</span>
      </div>
    </div>
  );
}
