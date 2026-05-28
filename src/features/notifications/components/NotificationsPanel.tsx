import { Bell, Loader2, Mail, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import {
  NOTIFICATION_TYPE_COLORS,
  NOTIFICATION_TYPE_LABELS,
} from '../../../core/supabase/services/notifications.service';

export function NotificationsPanel() {
  const { items, unreadCount, loading, error, refresh, markRead, markAllRead } = useNotifications();

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-bold text-rose-500 flex items-center gap-2">
          <Bell /> Notificaciones
          {unreadCount > 0 && (
            <span className="text-xs bg-rose-500 text-polar-white px-2 py-0.5 rounded-full font-black">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs text-muted hover:text-foreground flex items-center gap-1"
            >
              <CheckCheck size={14} /> Marcar todas leídas
            </button>
          )}
          <button type="button" onClick={refresh} className="text-cyan-400 text-sm font-bold hover:text-cyan-300">
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <p className="text-brand400 text-sm mb-4">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted">
          <Loader2 className="animate-spin mr-2" size={20} />
          Cargando…
        </div>
      ) : items.length === 0 ? (
        <p className="text-muted text-center py-8">
          Sin notificaciones. Recibirás avisos aquí y por email cuando haya movimientos en tu cuenta.
        </p>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto">
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => !n.read_at && markRead(n.id)}
              className={`w-full text-left p-4 rounded-xl border-l-4 transition-opacity ${
                NOTIFICATION_TYPE_COLORS[n.type] ?? 'border-l-gray-500 bg-surface-alt'
              } ${n.read_at ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-foreground font-bold text-sm">{n.title}</p>
                <span className="text-[10px] text-muted uppercase shrink-0">
                  {NOTIFICATION_TYPE_LABELS[n.type] ?? n.type}
                </span>
              </div>
              <p className="text-muted text-xs mt-1">{n.body}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-muted">
                <span>{new Date(n.created_at).toLocaleString('es-CO')}</span>
                {n.email_sent_at && (
                  <span className="flex items-center gap-1 text-cyan-600">
                    <Mail size={10} /> Email enviado
                  </span>
                )}
                {!n.read_at && <span className="text-rose-400 font-bold">Nuevo</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
