import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  LineChart,
  BookOpen,
  Users,
  PhoneCall,
  ListChecks,
  Target,
  Crown,
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

export { ROLE_HOME, getRoleHome, CLIENT_PATHS } from '../routing/paths';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export interface IconRailItem {
  to: string;
  label: string;
  icon: LucideIcon;
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
        { to: '/dashboard/floor?tab=reasignacion', label: 'Reasignaci├│n', icon: ListChecks },
      ];
    case 'MANAGER':
      return [
        { to: '/dashboard/manager', label: 'Metas y Capacitaci├│n', icon: Target, section: 'Direcci├│n' },
      ];
    case 'CHIEF':
      return [
        { to: '/dashboard/chief', label: 'Dep├│sitos y Leads', icon: ListChecks, section: 'Ejecutivo' },
        { to: '/dashboard/supervisor-market', label: 'Mercado (supervisor)', icon: LineChart },
        { to: '/dashboard/head?tab=web-registrations', label: 'Registros Web', icon: Globe },
      ];
    case 'HEAD':
      return [
        { to: '/dashboard/head?tab=overview', label: 'Centro de Comando', icon: Crown, section: 'Alta dirección' },
        { to: '/dashboard/head?tab=clientes', label: 'Clientes', icon: UserCircle },
        { to: '/dashboard/head?tab=leads', label: 'CRM & Leads', icon: ListChecks },
        { to: '/dashboard/head?tab=personnel', label: 'Personal', icon: Users },
      ];
    default:
      return [];
  }
}

const CLIENT_RAIL_PATHS = [
  CLIENT_PATHS.trade,
  CLIENT_PATHS.accountTab('resumen'),
  CLIENT_PATHS.accountTab('depositar'),
  CLIENT_PATHS.accountTab('notificaciones'),
] as const;

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

export function getIconRailItems(role: Role): IconRailItem[] {
  const nav = getRoleNavItems(role);
  if (role === 'CLIENT') {
    return CLIENT_RAIL_PATHS.map((path) => {
      const item = nav.find((n) => n.to === path);
      return item
        ? { to: item.to, label: item.label, icon: item.icon }
        : { to: path, label: path, icon: LineChart };
    }).filter((i) => i.label !== i.to);
  }
  return nav.slice(0, 5).map(({ to, label, icon }) => ({ to, label, icon }));
}
