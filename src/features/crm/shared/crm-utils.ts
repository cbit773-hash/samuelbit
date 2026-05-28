export function leadName(lead: { first_name: string; last_name: string }) {
  return `${lead.first_name} ${lead.last_name}`.trim();
}

export function formatCrmMoney(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export const LEAD_STATUSES = [
  'Nuevo',
  'Contactado',
  'En seguimiento',
  'Cerca de cierre',
  'No contesta',
  'Cerrado (FTD)',
  'Descartado',
] as const;
