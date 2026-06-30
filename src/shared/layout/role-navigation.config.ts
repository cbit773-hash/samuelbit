import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  LineChart,
  BookOpen,
  Users,
  PhoneCall,
  ListChecks,
  Target,
  Headphones,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Bell,
  Globe,
  TrendingUp,
  Shield,
  UserCircle,
} from 'lucide-react';
import type { Role } from '../../features/auth/store/auth.store';
import { CLIENT_PATHS } from '../routing/paths';
import { HEAD_TABS, headTabToPath } from '../../features/crm/config/head-tabs.config';

export { ROLE_HOME, getRoleHome, CLIENT_PATHS } from '../routing/paths';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

function getHeadNavItems(): NavItem[] {
  return HEAD_TABS.map((tab) => ({
    to: headTabToPath(tab.id),
    label: tab.label,
    icon: tab.icon,
    ...('section' in tab && tab.section ? { section: tab.section } : {}),
  }));
}

export function getRoleNavItems(role: Role): NavItem[] {
  switch (role) {
    case 'CLIENT':
      return [
        { to: CLIENT_PATHS.trade, label: 'Invertir', icon: LineChart, section: 'Operar' },
        { to: CLIENT_PATHS.accountTab('resumen'), label: 'Mi cuenta', icon: LayoutDashboard, section: 'Mi dinero' },
        { to: CLIENT_PATHS.accountTab('depositar'), label: 'Depositar', icon: ArrowUpCircle },
        { to: CLIENT_PATHS.accountTab('retirar'), label: 'Retirar', icon: ArrowDownCircle },
        { to: CLIENT_PATHS.accountTab('portafolio'), label: 'Portafolio', icon: TrendingUp },
        { to: CLIENT_PATHS.accountTab('historial'), label: 'Historial', icon: BarChart3 },
        { to: CLIENT_PATHS.accountTab('notificaciones'), label: 'Alertas', icon: Bell },
        { to: CLIENT_PATHS.accountTab('perfil'), label: 'Mi perfil', icon: UserCircle, section: 'Cuenta y legal' },
        { to: CLIENT_PATHS.accountTab('seguridad'), label: 'KYC', icon: Shield },
        { to: CLIENT_PATHS.legal, label: 'Legal', icon: BookOpen },
      ];
    case 'AGENT':
      return [
        { to: '/dashboard/agent?tab=dialer', label: 'Auto-Dialer', icon: PhoneCall, section: 'Ventas' },
        { to: '/dashboard/agent?tab=ventas', label: 'Mis Ventas (FTD)', icon: Target },
        { to: '/dashboard/agent?tab=leads', label: 'Leads', icon: ListChecks },
      ];
    case 'TEAM_LEADER':
      return [
        { to: '/dashboard/team-leader?tab=monitor', label: 'Estado de Mesa', icon: Users, section: 'Mesa' },
        { to: '/dashboard/team-leader?tab=leads', label: 'Leads de Mesa', icon: ListChecks },
        { to: '/dashboard/team-leader', label: 'Escucha de Llamadas', icon: Headphones },
      ];
    case 'FLOOR_MANAGER':
      return [
        { to: '/dashboard/floor?tab=monitor', label: 'Monitor In-Live', icon: Users, section: 'Piso' },
        { to: '/dashboard/floor?tab=reasignacion', label: 'Reasignación', icon: ListChecks },
      ];
    case 'MANAGER':
      return [
        { to: '/dashboard/manager', label: 'Metas y Capacitación', icon: Target, section: 'Dirección' },
      ];
    case 'CHIEF':
      return [
        { to: '/dashboard/chief', label: 'Depósitos y Leads', icon: ListChecks, section: 'Ejecutivo' },
        { to: headTabToPath('web-registrations'), label: 'Registros Web', icon: Globe },
        { to: '/dashboard/supervisor-market', label: 'Mercado (supervisor)', icon: LineChart, section: 'Mercado' },
      ];
    case 'HEAD':
      return getHeadNavItems();
    default:
      return [];
  }
}

export function getRoleDisplayLabel(role: Role): string {
  const labels: Record<Role, string> = {
    CLIENT: 'Inversor',
    AGENT: 'Asesor',
    TEAM_LEADER: 'Team Leader',
    FLOOR_MANAGER: 'Floor Manager',
    MANAGER: 'Manager',
    CHIEF: 'Chief',
    HEAD: 'Head',
  };
  return labels[role] ?? role;
}
