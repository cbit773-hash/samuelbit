import { CheckCircle, AlertCircle } from 'lucide-react';

export type ActionMessage = { type: 'success' | 'error'; text: string } | null;

export function ActionBanner({ message }: { message: ActionMessage }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
        message.type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}
    >
      {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <p className="text-sm font-medium">{message.text}</p>
    </div>
  );
}
