import twilio from 'npm:twilio@5';
import { createAdminClient } from './supabase-admin.ts';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function getTwilioPhoneNumber(): string {
  return requireEnv('TWILIO_PHONE_NUMBER');
}

export function buildVoiceToken(identity: string): string {
  const accountSid = requireEnv('TWILIO_ACCOUNT_SID');
  const apiKeySid = requireEnv('TWILIO_API_KEY_SID');
  const apiKeySecret = requireEnv('TWILIO_API_KEY_SECRET');
  const twimlAppSid = requireEnv('TWILIO_TWIML_APP_SID');

  const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
    identity,
    ttl: 3600,
  });

  const grant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: false,
  });
  token.addGrant(grant);
  return token.toJwt();
}

/** Parsea body application/x-www-form-urlencoded de Twilio */
export async function parseTwilioBody(req: Request): Promise<Record<string, string>> {
  const text = await req.text();
  const params: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(text)) {
    params[k] = v;
  }
  return params;
}

export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string | null,
): boolean {
  if (!signature) return false;
  const authToken = requireEnv('TWILIO_AUTH_TOKEN');
  return twilio.validateRequest(authToken, signature, url, params);
}

/** Identity desde From: client:uuid */
export function parseClientIdentity(from: string | undefined): string | null {
  if (!from?.startsWith('client:')) return null;
  return from.slice('client:'.length) || null;
}

export async function assertAgentOwnsLead(
  agentId: string,
  leadId: string,
  toPhone: string,
): Promise<{ ok: true; leadPhone: string } | { ok: false; reason: string }> {
  const admin = createAdminClient();
  const { data: lead, error } = await admin
    .from('leads')
    .select('id, phone, assigned_to')
    .eq('id', leadId)
    .maybeSingle();

  if (error || !lead) {
    return { ok: false, reason: 'Lead no encontrado' };
  }
  if (lead.assigned_to !== agentId) {
    return { ok: false, reason: 'Lead no asignado a este agente' };
  }

  const normalizedTo = toPhone.replace(/\s/g, '');
  const normalizedLead = (lead.phone ?? '').replace(/\s/g, '');
  if (normalizedLead && normalizedTo && !normalizedLead.includes(normalizedTo.replace(/^\+/, '')) && !normalizedTo.includes(normalizedLead.replace(/^\+/, ''))) {
    // Comparación flexible: mismos dígitos finales
    const digitsTo = normalizedTo.replace(/\D/g, '');
    const digitsLead = normalizedLead.replace(/\D/g, '');
    if (!digitsTo.endsWith(digitsLead.slice(-10)) && !digitsLead.endsWith(digitsTo.slice(-10))) {
      return { ok: false, reason: 'Número no coincide con el lead' };
    }
  }

  return { ok: true, leadPhone: lead.phone };
}

export function twimlDial(to: string, callerId: string, statusCallbackUrl: string): string {
  const escapedTo = escapeXml(to);
  const escapedCaller = escapeXml(callerId);
  const escapedStatus = escapeXml(statusCallbackUrl);
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${escapedCaller}" answerOnBridge="true" statusCallback="${escapedStatus}" statusCallbackEvent="initiated ringing answered completed" statusCallbackMethod="POST">
    <Number>${escapedTo}</Number>
  </Dial>
</Response>`;
}

export function twimlReject(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es">${escapeXml(message)}</Say>
  <Hangup/>
</Response>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const TERMINAL_STATUSES = new Set(['completed', 'busy', 'no-answer', 'failed', 'canceled']);

export function mapTwilioCallStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === 'in-progress') return 'in-progress';
  if (s === 'no-answer') return 'no-answer';
  if (TERMINAL_STATUSES.has(s)) return s;
  if (s === 'initiated' || s === 'ringing' || s === 'queued') return s;
  return s;
}

export function isTerminalCallStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status.toLowerCase());
}

export async function upsertCallLog(params: {
  callSid: string;
  agentId: string;
  leadId: string | null;
  fromNumber: string | null;
  toNumber: string | null;
  status: string;
  durationSeconds?: number | null;
}): Promise<void> {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const terminal = isTerminalCallStatus(params.status);

  const { data: existing } = await admin
    .from('call_logs')
    .select('id')
    .eq('twilio_call_sid', params.callSid)
    .maybeSingle();

  const row = {
    twilio_call_sid: params.callSid,
    agent_id: params.agentId,
    lead_id: params.leadId,
    direction: 'outbound',
    from_number: params.fromNumber,
    to_number: params.toNumber,
    status: mapTwilioCallStatus(params.status),
    duration_seconds: params.durationSeconds ?? null,
    ended_at: terminal ? now : null,
  };

  if (existing?.id) {
    await admin.from('call_logs').update(row).eq('id', existing.id);
  } else {
    await admin.from('call_logs').insert({
      ...row,
      started_at: now,
    });
  }
}

export function getStatusCallbackUrl(): string {
  const base = Deno.env.get('SUPABASE_URL') ?? '';
  return `${base}/functions/v1/twilio-voice-status`;
}
