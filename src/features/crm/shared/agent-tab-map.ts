/** Mapeo URL ?tab= ↔ id de tarea del Arsenal */
export const AGENT_TAB_TO_TASK: Record<string, string> = {
  dialer: 'Auto-Dialer',
  ventas: 'Mis Ventas (FTD)',
  leads: 'Mis Leads',
  callbacks: 'Callbacks',
  scripting: 'Scripting',
  sos: 'Botón SOS',
  cobro: 'Cobro Rápido',
  ranking: 'Ranking',
  crm: 'CRM Notas',
  kyc: 'KYC & Legal',
  presencia: 'Estado Laboral',
};

export const AGENT_TASK_TO_TAB: Record<string, string> = Object.fromEntries(
  Object.entries(AGENT_TAB_TO_TASK).map(([tab, task]) => [task, tab]),
);

export function taskFromTab(tab: string | null): string {
  if (!tab) return 'Auto-Dialer';
  return AGENT_TAB_TO_TASK[tab] ?? 'Auto-Dialer';
}

export function tabFromTask(taskId: string): string | null {
  return AGENT_TASK_TO_TAB[taskId] ?? null;
}
