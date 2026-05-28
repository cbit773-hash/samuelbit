export const TX_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  failed: 'Fallido',
  cancelled: 'Cancelado',
};

export const TX_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-accent-lime/20 text-brand400',
  processing: 'bg-primary/20 text-brand',
  completed: 'bg-emerald-500/20 text-emerald-400',
  failed: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-gray-500/20 text-muted',
};
