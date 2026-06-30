import type { LucideIcon } from 'lucide-react';
import {
  Crown,
  UserCircle,
  ListChecks,
  Users,
  Globe,
  Banknote,
  BarChart3,
  ShieldAlert,
  Settings,
} from 'lucide-react';

export const HEAD_TABS = [
  {
    id: 'overview',
    label: 'Centro de Comando',
    description: 'KPIs globales, alertas y visión 360° de la operación.',
    icon: Crown,
    section: 'Alta dirección',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    description: 'Cartera de clientes activos y perfiles de cuenta.',
    icon: UserCircle,
  },
  {
    id: 'leads',
    label: 'CRM & Leads',
    description: 'Pipeline completo, reasignación e inyección de prospectos.',
    icon: ListChecks,
    section: 'Operación',
  },
  {
    id: 'personnel',
    label: 'Personal',
    description: 'Gestión de empleados, roles y equipos.',
    icon: Users,
  },
  {
    id: 'web-registrations',
    label: 'Registros Web',
    description: 'Cuentas creadas en /registro, CSV y asignación de agente.',
    icon: Globe,
  },
  {
    id: 'deposits',
    label: 'Auditoría Depósitos',
    description: 'Aprobar, rechazar y auditar depósitos de la plataforma.',
    icon: Banknote,
    section: 'Finanzas',
  },
  {
    id: 'performance',
    label: 'Rendimiento Mesas',
    description: 'Comparativo de equipos, FTDs y conversión por mesa.',
    icon: BarChart3,
    section: 'Control',
  },
  {
    id: 'fraud',
    label: 'Anti-Fraude',
    description: 'Señales de riesgo y patrones anómalos.',
    icon: ShieldAlert,
  },
  {
    id: 'settings',
    label: 'Configuración',
    description: 'Metas globales, parámetros de riesgo y logs de auditoría.',
    icon: Settings,
    section: 'Sistema',
  },
] as const;

export type HeadTabId = (typeof HEAD_TABS)[number]['id'];

export type HeadTabMeta = {
  id: HeadTabId;
  label: string;
  description: string;
  icon: LucideIcon;
  section?: string;
};

export const DEFAULT_HEAD_TAB: HeadTabId = 'overview';

export function isValidHeadTab(tab: string | null): tab is HeadTabId {
  return tab != null && HEAD_TABS.some((t) => t.id === tab);
}

export function getHeadTabMeta(tab: HeadTabId): HeadTabMeta {
  return HEAD_TABS.find((t) => t.id === tab) ?? HEAD_TABS[0];
}

export function headTabToPath(tab: HeadTabId): string {
  return `/dashboard/head?tab=${tab}`;
}
