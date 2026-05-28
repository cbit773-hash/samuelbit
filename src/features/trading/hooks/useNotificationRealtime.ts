import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../../../core/supabase/client';
import { getUnreadCount } from '../../../core/supabase/services/notifications.service';
import { useAuthStore } from '../../auth/store/auth.store';
import { isDemoUserId } from '../../../core/supabase/demo-ids';

export interface RealtimeNotificationPayload {
  id: string;
  title: string;
  body: string;
  type: string;
}

/**
 * Suscripción Supabase Realtime a nuevas notificaciones (push in-app).
 * Requiere: tabla `notifications` en publicación supabase_realtime.
 */
export function useNotificationRealtime(onNew?: (n: RealtimeNotificationPayload) => void) {
  const user = useAuthStore((s) => s.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastPush, setLastPush] = useState<RealtimeNotificationPayload | null>(null);
  const onNewRef = useRef(onNew);
  onNewRef.current = onNew;

  const refreshCount = useCallback(async () => {
    if (!user || isDemoUserId(user.id)) {
      setUnreadCount(0);
      return;
    }
    setUnreadCount(await getUnreadCount());
  }, [user]);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  useEffect(() => {
    const userId = user?.id;
    if (!userId || isDemoUserId(userId)) return;

    const topic = `notifications:${userId}`;
    const realtimeTopic = `realtime:${topic}`;

    const existing = supabase.getChannels().find((c) => c.topic === realtimeTopic);
    if (existing) {
      supabase.removeChannel(existing);
    }

    const channel = supabase
      .channel(topic)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as RealtimeNotificationPayload;
          setLastPush(row);
          setUnreadCount((c) => c + 1);
          onNewRef.current?.(row);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const dismissPush = () => setLastPush(null);

  return { unreadCount, lastPush, dismissPush, refreshCount };
}
