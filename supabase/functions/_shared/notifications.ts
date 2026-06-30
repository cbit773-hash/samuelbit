import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

/** Stub lite — Resend opcional; ver docs/GUIA_NOTIFICACIONES.md */
export async function notifyDepositPending(
  _admin: SupabaseClient,
  _appUrl: string,
  _clientId: string,
  _amount: number,
  _transactionId: string,
): Promise<void> {}

export async function notifyWebLeadRegistered(
  _admin: SupabaseClient,
  _appUrl: string,
  _lead: Record<string, unknown>,
): Promise<void> {}
