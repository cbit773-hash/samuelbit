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

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TransactionType = 'deposit' | 'withdrawal';

export type KycStatus = 'none' | 'pending' | 'submitted' | 'verified' | 'rejected';

export type KycDocumentType = 'id_front' | 'id_back' | 'proof_of_address' | 'selfie';

export type PayoutProfileStatus = 'pending' | 'approved' | 'rejected';

// ─── Row Types ───────────────────────────────────────────────
export type AgentPresence = 'ready' | 'in_call' | 'wrap_up' | 'break' | 'restroom' | 'offline';
export type SosStatus = 'open' | 'acknowledged' | 'resolved' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  country?: string | null;
  interest_level?: string | null;
  onboarding_completed_at?: string | null;
  role: UserRole;
  team_id: string | null;
  work_status?: AgentPresence;
  work_status_since?: string | null;
  work_status_note?: string | null;
  kyc_status?: KycStatus;
  kyc_submitted_at?: string | null;
  kyc_reviewed_at?: string | null;
  kyc_reviewed_by?: string | null;
  kyc_rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface KycDocument {
  id: string;
  client_id: string;
  document_type: KycDocumentType;
  storage_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  uploaded_at: string;
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
  source?: string;
  client_user_id?: string | null;
  // Joined fields
  assigned_profile?: Profile;
  created_by_profile?: Profile;
}

export interface CallLog {
  id: string;
  lead_id: string | null;
  agent_id: string;
  twilio_call_sid: string | null;
  direction: string;
  from_number: string | null;
  to_number: string | null;
  status: string;
  duration_seconds: number | null;
  recording_url: string | null;
  started_at: string;
  ended_at: string | null;
}

export interface LeadCallback {
  id: string;
  lead_id: string;
  agent_id: string;
  scheduled_at: string;
  timezone: string;
  reason: string | null;
  status: 'pending' | 'completed' | 'cancelled' | 'missed';
  completed_at: string | null;
  created_at: string;
}

export interface SosAlert {
  id: string;
  agent_id: string;
  lead_id: string | null;
  call_log_id: string | null;
  floor_manager_id: string | null;
  team_id: string | null;
  status: SosStatus;
  message: string | null;
  created_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  agent_profile?: Profile;
}

export interface TeamLeaderboardRow {
  agent_id: string;
  full_name: string;
  ftd_count: number;
  approved_volume: number;
  rank_pos: number;
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

export interface Wallet {
  id: string;
  client_id: string;
  balance: number;
  currency: string;
  total_deposited: number;
  total_withdrawn: number;
  is_frozen: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  client_id: string;
  type: TransactionType;
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  payment_method: string;
  status: TransactionStatus;
  external_id: string | null;
  external_url: string | null;
  invoice_id: string | null;
  payment_id: string | null;
  gateway: string | null;
  crypto_address: string | null;
  crypto_txid: string | null;
  crypto_network: string | null;
  notes: string | null;
  approved_by: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface PaymentEvent {
  id: string;
  transaction_id: string | null;
  event_type: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export type NotificationType =
  | 'deposit_pending'
  | 'deposit_completed'
  | 'deposit_rejected'
  | 'withdrawal_requested'
  | 'withdrawal_completed'
  | 'withdrawal_rejected'
  | 'kyc_submitted'
  | 'kyc_verified'
  | 'kyc_rejected'
  | 'sos_open'
  | 'sos_ack'
  | 'callback_due'
  | 'system'
  | 'security';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  read_at: string | null;
  email_sent_at: string | null;
  created_at: string;
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
  country?: string | null;
  interest_level?: string | null;
  role?: UserRole;
  team_id?: string | null;
}

/** Payload para RPC complete_client_onboarding */
export interface ClientOnboardingPayload {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  interest?: string;
  utm_notes?: string | null;
}

export interface ClientOnboardingResult {
  ok: boolean;
  wallet_id: string;
  lead_id: string | null;
  notification_id: string | null;
}

export interface ClientPayoutProfile {
  client_id: string;
  bank_name: string | null;
  bank_cci: string | null;
  account_holder: string | null;
  crypto_address: string | null;
  crypto_network: string;
  status: PayoutProfileStatus;
  previous_snapshot?: Record<string, unknown> | null;
  submitted_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  rejection_reason?: string | null;
  updated_at: string;
}

export interface ClientPayoutProfileSubmit {
  bank_name: string;
  bank_cci: string;
  account_holder: string;
  crypto_address?: string | null;
  crypto_network?: string;
}

export interface PendingPayoutProfileRow extends ClientPayoutProfile {
  email: string;
  full_name: string;
  phone: string | null;
  kyc_status: KycStatus | null;
}
