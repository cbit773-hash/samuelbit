import { Mail, Phone, ShieldAlert, Snowflake } from 'lucide-react';
import type { Profile } from '../../../../../core/supabase/database.types';
import type { Wallet } from '../../../../../core/supabase/services/wallet.service';

interface ClientDetailHeaderProps {
  profile: Profile;
  wallet: Wallet | null;
}

export function ClientDetailHeader({ profile, wallet }: ClientDetailHeaderProps) {
  const blocked = profile.is_blocked === true;
  const frozen = wallet?.is_frozen === true;

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">{profile.full_name}</h2>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={14} />
              {profile.email}
            </span>
            {profile.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} />
                {profile.phone}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {blocked && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-xs font-bold border border-rose-500/25">
              <ShieldAlert size={14} />
              Cuenta bloqueada
            </span>
          )}
          {frozen && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/25">
              <Snowflake size={14} />
              Billetera congelada
            </span>
          )}
        </div>
      </div>
      {blocked && profile.block_reason && (
        <p className="mt-3 text-sm text-rose-300/90">Motivo: {profile.block_reason}</p>
      )}
    </div>
  );
}
