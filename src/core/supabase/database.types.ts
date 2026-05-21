// ============================================================
// INVESPRO — Tipos de la Base de Datos (Supabase)
// Generado manualmente a partir del schema.sql
// ============================================================

// ─── Enums ───────────────────────────────────────────────────
export type UserRole = 'CLIENT' | 'AGENT' | 'TEAM_LEADER' | 'FLOOR_MANAGER' | 'MANAGER' | 'CHIEF' | 'HEAD';

export type LeadStatus =
  | 'Nuevo'
  | 'Contactado'
  | 'En seguimiento'
  | 'Cerca de cierre'
  | 'No contesta'
  | 'Cerrado (FTD)'
  | 'Descartado';

export type DepositStatus = 'Verificando' | 'Aprobado' | 'Rechazado';

export type DepositType = 'FTD' | 'RETENCION';

// ─── Row Types ───────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  team_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  floor_manager_id: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  country: string | null;
  status: LeadStatus;
  interest: string;
  notes: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  last_contact: string | null;
  // Joined fields
  assigned_profile?: Profile;
  created_by_profile?: Profile;
}

export interface Deposit {
  id: string;
  client_id: string;
  agent_id: string;
  amount: number;
  currency: string;
  type: DepositType;
  status: DepositStatus;
  notes: string | null;
  created_at: string;
  // Joined fields
  client_profile?: Profile;
  agent_profile?: Profile;
}

export interface Position {
  id: string;
  client_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  open_price: number;
  close_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  pnl: number | null;
  status: 'OPEN' | 'CLOSED';
  opened_at: string;
  closed_at: string | null;
}

// ─── Insert Types ────────────────────────────────────────────
export interface LeadInsert {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  country?: string | null;
  status?: LeadStatus;
  interest?: string;
  notes?: string | null;
  assigned_to?: string | null;
  created_by?: string | null;
}

export interface DepositInsert {
  client_id: string;
  agent_id: string;
  amount: number;
  currency?: string;
  type: DepositType;
  status?: DepositStatus;
  notes?: string | null;
}

export interface PositionInsert {
  client_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  open_price: number;
  stop_loss?: number | null;
  take_profit?: number | null;
}

// ─── Update Types ────────────────────────────────────────────
export interface LeadUpdate {
  status?: LeadStatus;
  notes?: string | null;
  assigned_to?: string | null;
  last_contact?: string | null;
}

export interface DepositUpdate {
  status?: DepositStatus;
  notes?: string | null;
}

export interface ProfileUpdate {
  full_name?: string;
  phone?: string | null;
  role?: UserRole;
  team_id?: string | null;
}
