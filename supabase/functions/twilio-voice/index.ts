import {
  assertAgentOwnsLead,
  getStatusCallbackUrl,
  getTwilioPhoneNumber,
  parseClientIdentity,
  parseTwilioBody,
  twimlDial,
  twimlReject,
  upsertCallLog,
  validateTwilioSignature,
} from '../_shared/twilio-client.ts';

function twimlResponse(xml: string, status = 200): Response {
  return new Response(xml, {
    status,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return twimlResponse(twimlReject('Método no permitido'), 405);
  }

  const url = new URL(req.url).toString();
  const signature = req.headers.get('X-Twilio-Signature');
  const params = await parseTwilioBody(req);

  if (!validateTwilioSignature(url, params, signature)) {
    console.error('[twilio-voice] Invalid Twilio signature');
    return twimlResponse(twimlReject('No autorizado'), 403);
  }

  const to = params.To ?? params.to ?? '';
  const leadId = params.LeadId ?? params.leadId ?? '';
  const from = params.From ?? '';
  const callSid = params.CallSid ?? '';

  const agentId = parseClientIdentity(from);
  if (!agentId) {
    return twimlResponse(twimlReject('Identidad de agente inválida'));
  }

  if (!to || !leadId) {
    return twimlResponse(twimlReject('Faltan parámetros To o LeadId'));
  }

  const ownership = await assertAgentOwnsLead(agentId, leadId, to);
  if (!ownership.ok) {
    return twimlResponse(twimlReject(ownership.reason));
  }

  let callerId: string;
  try {
    callerId = getTwilioPhoneNumber();
  } catch (e) {
    console.error('[twilio-voice]', e);
    return twimlResponse(twimlReject('Configuración Twilio incompleta'));
  }

  if (callSid) {
    await upsertCallLog({
      callSid,
      agentId,
      leadId,
      fromNumber: callerId,
      toNumber: to,
      status: 'initiated',
    });
  }

  const statusUrl = getStatusCallbackUrl();
  return twimlResponse(twimlDial(to, callerId, statusUrl));
});
