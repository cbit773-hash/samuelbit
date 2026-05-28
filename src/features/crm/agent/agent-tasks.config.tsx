import {
  PhoneCall, Target, Calendar, MessageSquare, AlertTriangle,
  CreditCard, Trophy, FileText, Shield, Coffee, ListChecks,
} from 'lucide-react';
import type { CrmTaskItem } from '../layout/CrmTaskGrid';

export const AGENT_TASKS: CrmTaskItem[] = [
  { id: 'Auto-Dialer', icon: <PhoneCall size={20} />, title: 'Auto-Dialer', desc: 'Marcación continua.', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'Mis Ventas (FTD)', icon: <Target size={20} />, title: 'Mis Ventas (FTD)', desc: 'Comisiones y cierres.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'Callbacks', icon: <Calendar size={20} />, title: 'Callbacks', desc: 'Agenda de seguimientos.', color: 'text-brand', bg: 'bg-primary/10' },
  { id: 'Scripting', icon: <MessageSquare size={20} />, title: 'Scripting', desc: 'Guiones por objeción.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'Botón SOS', icon: <AlertTriangle size={20} />, title: 'Botón SOS', desc: 'Ayuda del Floor Manager.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'Cobro Rápido', icon: <CreditCard size={20} />, title: 'Cobro Rápido', desc: 'Links de pago a 1 clic.', color: 'text-brand', bg: 'bg-accent-lime/10' },
  { id: 'Ranking', icon: <Trophy size={20} />, title: 'Ranking', desc: 'Posición en la mesa.', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'CRM Notas', icon: <FileText size={20} />, title: 'CRM Notas', desc: 'Historial del cliente.', color: 'text-muted', bg: 'bg-gray-400/10' },
  { id: 'KYC & Legal', icon: <Shield size={20} />, title: 'KYC & Legal', desc: 'Envío de PDFs.', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'Estado Laboral', icon: <Coffee size={20} />, title: 'Estado Laboral', desc: 'Pausas y descansos.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

export const AGENT_LEADS_TASK: CrmTaskItem = {
  id: 'Mis Leads',
  icon: <ListChecks size={20} />,
  title: 'Mis Leads',
  desc: 'Lista completa.',
  color: 'text-cyan-400',
  bg: 'bg-cyan-500/10',
};
