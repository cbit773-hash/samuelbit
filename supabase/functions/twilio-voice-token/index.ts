import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { createUserClient } from '../_shared/supabase-admin.ts';
import { buildVoiceToken } from '../_shared/twilio-client.ts';

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const userClient = createUserClient(authHeader);
  const { data: { user }, error: authError } = await userClient.auth.getUser();

  if (authError || !user) {
    return jsonResponse({ error: 'Invalid session' }, 401);
  }

  const { data: profile } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role as string | undefined;
  if (!role || !['AGENT', 'TEAM_LEADER', 'FLOOR_MANAGER', 'MANAGER', 'CHIEF', 'HEAD'].includes(role)) {
    return jsonResponse({ error: 'Solo roles operativos pueden usar el dialer' }, 403);
  }

  try {
    const token = buildVoiceToken(user.id);
    return jsonResponse({ token, identity: user.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Twilio config error';
    console.error('[twilio-voice-token]', msg);
    return jsonResponse({ error: msg }, 500);
  }
});
