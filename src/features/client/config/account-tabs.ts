export const CLIENT_ACCOUNT_TABS = {
  resumen: { label: 'Resumen', description: 'Balance, equidad y actividad reciente.' },
  perfil: { label: 'Mi perfil', description: 'Datos personales y cuenta de retiro.' },
  depositar: { label: 'Depositar', description: 'Añade fondos a tu cuenta.' },
  retirar: { label: 'Retirar', description: 'Solicita retiro de fondos.' },
  historial: { label: 'Historial', description: 'Movimientos de depósitos y retiros.' },
  portafolio: { label: 'Portafolio', description: 'Posiciones abiertas y cerradas.' },
  notificaciones: { label: 'Alertas', description: 'Avisos del broker.' },
  seguridad: { label: 'Verificación KYC', description: 'Documentos y verificación de identidad.' },
} as const;

export type ClientAccountTabId = keyof typeof CLIENT_ACCOUNT_TABS;

export const DEFAULT_ACCOUNT_TAB: ClientAccountTabId = 'resumen';

export const WALLET_DEPENDENT_TABS: ClientAccountTabId[] = ['resumen', 'depositar', 'retirar'];

export function isValidAccountTab(tab: string | null): tab is ClientAccountTabId {
  return tab != null && tab in CLIENT_ACCOUNT_TABS;
}
