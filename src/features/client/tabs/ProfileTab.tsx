import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useAuthStore } from '../../auth/store/auth.store';
import { getMyProfile, updateProfile } from '../../../core/supabase/services/profiles.service';
import { getMyPayoutProfile } from '../../../core/supabase/services/client-payout-profile.service';
import type { ClientPayoutProfile, Profile } from '../../../core/supabase/database.types';
import { InvestProMemberCard } from '../components/InvestProMemberCard';
import { PayoutProfileForm } from '../components/PayoutProfileForm';

export function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payoutProfile, setPayoutProfile] = useState<ClientPayoutProfile | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, pp] = await Promise.all([getMyProfile(), getMyPayoutProfile()]);
    setProfile(p);
    setPayoutProfile(pp);
    setPhone(p?.phone ?? '');
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const savePhone = async () => {
    if (!user?.id) return;
    setSavingPhone(true);
    setPhoneMsg(null);
    const updated = await updateProfile(user.id, { phone: phone.trim() || null });
    setSavingPhone(false);
    if (updated) {
      setProfile(updated);
      setPhoneMsg('Teléfono actualizado.');
    } else {
      setPhoneMsg('No se pudo guardar el teléfono.');
    }
  };

  const identityLocked = profile?.kyc_status === 'verified';

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted">
        <Loader2 className="animate-spin mr-2" size={24} />
        Cargando perfil…
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl">
      <InvestProMemberCard
        fullName={profile?.full_name ?? user?.email ?? 'Inversor'}
        clientId={user?.id ?? ''}
        kycStatus={profile?.kyc_status}
      />

      <div className="bg-surface-alt border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Datos personales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted text-xs mb-1">Correo</p>
            <p className="text-foreground font-medium">{profile?.email ?? user?.email}</p>
          </div>
          <div>
            <p className="text-muted text-xs mb-1">Nombre completo</p>
            <p className="text-foreground font-medium">{profile?.full_name ?? '—'}</p>
            {identityLocked && (
              <p className="text-[10px] text-muted mt-1">Bloqueado tras verificación KYC</p>
            )}
          </div>
          <div>
            <p className="text-muted text-xs mb-1">País</p>
            <p className="text-foreground">{profile?.country ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted text-xs mb-1">Registro</p>
            <p className="text-foreground">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-PE') : '—'}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs mb-1">Interés</p>
            <p className="text-foreground">{profile?.interest_level ?? '—'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <label className="block text-xs font-semibold text-muted mb-1.5">Teléfono / WhatsApp</label>
          <div className="flex gap-2 max-w-md">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-surface-inset border border-border rounded-lg px-4 py-2.5 text-foreground text-sm"
              placeholder="+51 987 654 321"
            />
            <button
              type="button"
              onClick={savePhone}
              disabled={savingPhone}
              className="shrink-0 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-inset text-foreground text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              {savingPhone ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Guardar
            </button>
          </div>
          {phoneMsg && <p className="text-xs text-brand mt-2">{phoneMsg}</p>}
        </div>
      </div>

      <PayoutProfileForm profile={payoutProfile} onSaved={() => void load()} />
    </div>
  );
}
