import { Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationRealtime } from '../../features/trading/hooks/useNotificationRealtime';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { getNotificationInboxPath } from '../routing/paths';

export function NotificationToast() {
  const role = useAuthStore((s) => s.role);
  const { lastPush, dismissPush, unreadCount } = useNotificationRealtime();

  if (!lastPush) return null;

  const href = getNotificationInboxPath(role);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in">
      <div className="bg-surface-inset border border-cyan-500/40 rounded-xl shadow-2xl p-4 flex gap-3">
        <Bell className="text-cyan-400 shrink-0" size={22} />
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-bold text-sm">{lastPush.title}</p>
          <p className="text-muted text-xs mt-1 line-clamp-2">{lastPush.body}</p>
          <Link
            to={href}
            onClick={dismissPush}
            className="text-cyan-400 text-xs font-bold mt-2 inline-block hover:underline"
          >
            Ver notificaciones {unreadCount > 0 ? `(${unreadCount})` : ''}
          </Link>
        </div>
        <button type="button" onClick={dismissPush} className="text-muted hover:text-foreground shrink-0">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
