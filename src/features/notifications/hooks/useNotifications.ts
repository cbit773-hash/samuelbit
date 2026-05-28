import { useCallback, useEffect, useState } from 'react';
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../../core/supabase/services/notifications.service';
import type { Notification } from '../../../core/supabase/database.types';
import { isDemoUserId } from '../../../core/supabase/demo-ids';
import { useAuthStore } from '../../auth/store/auth.store';

export function useNotifications() {
  const user = useAuthStore((s) => s.user);
  const isDemo = isDemoUserId(user?.id);

  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isDemo) {
      setLoading(false);
      setError('Inicia sesi├│n real para ver notificaciones de Supabase.');
      setItems([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [list, count] = await Promise.all([getMyNotifications(), getUnreadCount()]);
      setItems(list);
      setUnreadCount(count);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markRead = useCallback(async (id: string) => {
    const ok = await markNotificationRead(id);
    if (ok) await refresh();
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    const ok = await markAllNotificationsRead();
    if (ok) await refresh();
  }, [refresh]);

  return {
    items,
    unreadCount,
    loading,
    error,
    isDemo,
    refresh,
    markRead,
    markAllRead,
  };
}
