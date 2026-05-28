import {
  parseClientIdentity,
  parseTwilioBody,
  upsertCallLog,
  validateTwilioSignature,
} from '../_shared/twilio-client.ts';
import { createAdminClient } from '../_shared/supabase-admin.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(req.url).toString();
  const signature = req.headers.get('X-Twilio-Signature');
  const params = await parseTwilioBody(req);

  if (!validateTwilioSignature(url, params, signature)) {
    console.error('[twilio-voice-status] Invalid signature');
    return new Response('Forbidden', { status: 403 });
  }

  const callSid = params.CallSid ?? params.ParentCallSid ?? '';
  const callStatus = params.CallStatus ?? 'queued';
  const duration = params.CallDuration ? parseInt(params.CallDuration, 10) : null;
  const from = params.From ?? '';
  const to = params.To ?? '';
  let leadId: string | null = params.LeadId ?? params.leadId ?? null;

  let agentId = parseClientIdentity(from);
  if (!agentId && callSid) {
    const admin = createAdminClient();
    const { data: existing } = await admin
      .from('call_logs')
      .select('agent_id, lead_id')
      .eq('twilio_call_sid', callSid)
      .maybeSingle();
    if (existing?.agent_id) agentId = existing.agent_id;
    if (!leadId && existing?.lead_id) leadId = existing.lead_id;
  }

  if (!callSid || !agentId) {
    return new Response('ok', { status: 200 });
  }

  const resolvedLeadId = leadId;

  try {
    await upsertCallLog({
      callSid,
      agentId,
      leadId: resolvedLeadId,
      fromNumber: from || null,
      toNumber: to || null,
      status: callStatus,
      durationSeconds: Number.isFinite(duration) ? duration : null,
    });
  } catch (e) {
    console.error('[twilio-voice-status] upsert failed', e);
  }

  return new Response('ok', { status: 200, headers: { 'Content-Type': 'text/plain' } });
});
