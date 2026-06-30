import { supabase } from '../client';
import type { Profile } from '../database.types';
import type { Transaction, Wallet } from './wallet.service';
import type { Lead } from '../database.types';

export interface ClientBundle {
  profile: Profile;
  wallet: Wallet | null;
  lead: Lead | null;
  transactions: Transaction[];
  calls: Array<{
    id: string;
    direction: string;
    status: string;
    duration_seconds: number | null;
    started_at: string;
  }>;
}

export async function getClientBundle(clientId: string): Promise<ClientBundle | null> {
  const { data, error } = await supabase.rpc('staff_get_client_bundle', {
    p_client_id: clientId,
  });
  if (error) {
    console.error('[Staff] staff_get_client_bundle:', error);
    return null;
  }
  const bundle = data as {
    profile: Profile;
    wallet: Wallet | null;
    lead: Lead | null;
    transactions: Transaction[];
    calls: ClientBundle['calls'];
  };
  if (!bundle?.profile) return null;
  return {
    profile: bundle.profile,
    wallet: bundle.wallet,
    lead: bundle.lead?.id ? bundle.lead : null,
    transactions: bundle.transactions ?? [],
    calls: bundle.calls ?? [],
  };
}

export async function listClientProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.rpc('staff_list_profiles', {
    p_role: 'CLIENT',
    p_team_id: null,
  });
  if (error) {
    console.error('[Staff] staff_list_profiles CLIENT:', error);
    return [];
  }
  return (data ?? []) as Profile[];
}
