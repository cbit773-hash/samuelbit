import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { createUserClient } from '../_shared/supabase-admin.ts';

interface Body {
  transaction_id: string;
  action: 'approve' | 'reject';
  reason?: string;
}

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

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const { transaction_id, action, reason } = body;
  if (!transaction_id || !action) {
    return jsonResponse({ error: 'transaction_id and action required' }, 400);
  }

  const userClient = createUserClient(authHeader);
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Invalid session' }, 401);
  }

  const { data, error } = await userClient.rpc('chief_review_transaction', {
    p_tx_id: transaction_id,
    p_action: action,
    p_reason: reason ?? null,
  });

  if (error) {
    console.error('[approve-transaction]', error.message);
    return jsonResponse({ error: error.message }, 400);
  }

  return jsonResponse({ success: true, ...(data as Record<string, unknown>) });
});
