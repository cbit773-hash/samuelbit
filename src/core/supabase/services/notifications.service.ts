import { supabase } from '../client';
import type { Notification } from '../database.types';

export async function getMyNotifications(limit = 50): Promise<Notification[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Notifications] fetch error:', error);
    return [];
  }
  return (data ?? []) as Notification[];
}

export async function getUnreadCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('read_at', null);

  if (error) return 0;
  return count ?? 0;
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);

  return !error;
}

export async function markAllNotificationsRead(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('read_at', null);

  return !error;
}

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  deposit_pending: 'Depósito pendiente',
  deposit_completed: 'Depósito acreditado',
  deposit_rejected: 'Depósito rechazado',
  withdrawal_requested: 'Retiro solicitado',
  withdrawal_completed: 'Retiro procesado',
  withdrawal_rejected: 'Retiro rechazado',
  kyc_submitted: 'KYC enviado',
  kyc_verified: 'KYC aprobado',
  kyc_rejected: 'KYC rechazado',
  system: 'Sistema',
  security: 'Seguridad',
};

export const NOTIFICATION_TYPE_COLORS: Record<string, string> = {
  deposit_pending: 'border-l-accent-lime bg-accent-lime/10',
  deposit_completed: 'border-l-emerald-500 bg-emerald-500/10',
  deposit_rejected: 'border-l-rose-500 bg-rose-500/10',
  withdrawal_requested: 'border-l-blue-500 bg-primary/10',
  withdrawal_completed: 'border-l-emerald-500 bg-emerald-500/10',
  withdrawal_rejected: 'border-l-rose-500 bg-rose-500/10',
  kyc_submitted: 'border-l-accent-lime bg-accent-lime/10',
  kyc_verified: 'border-l-emerald-500 bg-emerald-500/10',
  kyc_rejected: 'border-l-rose-500 bg-rose-500/10',
  system: 'border-l-gray-500 bg-gray-500/10',
  security: 'border-l-purple-500 bg-purple-500/10',
};
