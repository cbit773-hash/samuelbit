// ============================================================
// INVESPRO — Perfil de retiro (CCI + crypto) con aprobación CHIEF
// ============================================================

import { supabase } from '../client';
import type {
  ClientPayoutProfile,
  ClientPayoutProfileSubmit,
  PendingPayoutProfileRow,
} from '../database.types';

export async function getMyPayoutProfile(): Promise<ClientPayoutProfile | null> {
  const { data, error } = await supabase.rpc('get_my_payout_profile');
  if (error) {
    console.error('[PayoutProfile] get_my_payout_profile:', error.message);
    return null;
  }
  if (!data) return null;
  return data as ClientPayoutProfile;
}

export async function submitMyPayoutProfile(
  payload: ClientPayoutProfileSubmit,
): Promise<{ profile: ClientPayoutProfile | null; error?: string }> {
  const { data, error } = await supabase.rpc('submit_my_payout_profile', {
    p_payload: {
      bank_name: payload.bank_name,
      bank_cci: payload.bank_cci,
      account_holder: payload.account_holder,
      crypto_address: payload.crypto_address ?? null,
      crypto_network: payload.crypto_network ?? 'TRC20',
    },
  });
  if (error) {
    return { profile: null, error: error.message };
  }
  return { profile: (data as ClientPayoutProfile) ?? null };
}

export async function listPendingPayoutProfiles(): Promise<PendingPayoutProfileRow[]> {
  const { data, error } = await supabase.rpc('chief_list_pending_payout_profiles');
  if (error) {
    console.error('[PayoutProfile] chief_list_pending:', error.message);
    return [];
  }
  if (!data || !Array.isArray(data)) return [];
  return data as PendingPayoutProfileRow[];
}

export async function reviewPayoutProfile(
  clientId: string,
  decision: 'approved' | 'rejected',
  reason?: string,
): Promise<{ profile: ClientPayoutProfile | null; error?: string }> {
  const { data, error } = await supabase.rpc('chief_review_payout_profile', {
    p_client_id: clientId,
    p_decision: decision,
    p_reason: reason ?? null,
  });
  if (error) {
    return { profile: null, error: error.message };
  }
  return { profile: (data as ClientPayoutProfile) ?? null };
}
