import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient, createUserClient } from '../_shared/supabase-admin.ts';
import { generateSecurePassword } from '../_shared/password.ts';

type AuthAdminAction = 'reset_password' | 'ban_login' | 'unban_login';

interface Body {
  client_id: string;
  action: AuthAdminAction;
}

async function assertHead(userClient: ReturnType<typeof createUserClient>) {
  const { data: { user }, error } = await userClient.auth.getUser();
  if (error || !user) {
    throw new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
  }

  const { data: role, error: roleError } = await userClient.rpc('get_auth_role');
  if (roleError || role !== 'HEAD') {
    throw new Response(JSON.stringify({ error: 'Forbidden: HEAD role required' }), { status: 403 });
  }

  return user;
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

  const { client_id, action } = body;
  if (!client_id || !action) {
    return jsonResponse({ error: 'client_id and action required' }, 400);
  }

  if (!['reset_password', 'ban_login', 'unban_login'].includes(action)) {
    return jsonResponse({ error: 'Invalid action' }, 400);
  }

  const userClient = createUserClient(authHeader);

  try {
    await assertHead(userClient);
  } catch (res) {
    if (res instanceof Response) return res;
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const admin = createAdminClient();

  if (action === 'reset_password') {
    const password = generateSecurePassword(12);
    const { error } = await admin.auth.admin.updateUserById(client_id, { password });
    if (error) {
      console.error('[staff-auth-admin] reset_password', error.message);
      return jsonResponse({ error: error.message }, 400);
    }

    const { error: logError } = await userClient.rpc('staff_log_auth_admin_action', {
      p_client_id: client_id,
      p_action: 'AUTH_PASSWORD_RESET',
      p_details: { action: 'reset_password' },
    });
    if (logError) {
      console.error('[staff-auth-admin] audit', logError.message);
    }

    return jsonResponse({ success: true, temporary_password: password });
  }

  if (action === 'ban_login') {
    const { error } = await admin.auth.admin.updateUserById(client_id, {
      ban_duration: '876000h',
    });
    if (error) {
      console.error('[staff-auth-admin] ban_login', error.message);
      return jsonResponse({ error: error.message }, 400);
    }

    const { error: logError } = await userClient.rpc('staff_log_auth_admin_action', {
      p_client_id: client_id,
      p_action: 'AUTH_LOGIN_BANNED',
      p_details: { action: 'ban_login' },
    });
    if (logError) {
      console.error('[staff-auth-admin] audit', logError.message);
    }

    return jsonResponse({ success: true });
  }

  const { error } = await admin.auth.admin.updateUserById(client_id, {
    ban_duration: 'none',
  });
  if (error) {
    console.error('[staff-auth-admin] unban_login', error.message);
    return jsonResponse({ error: error.message }, 400);
  }

  const { error: logError } = await userClient.rpc('staff_log_auth_admin_action', {
    p_client_id: client_id,
    p_action: 'AUTH_LOGIN_UNBANNED',
    p_details: { action: 'unban_login' },
  });
  if (logError) {
    console.error('[staff-auth-admin] audit', logError.message);
  }

  return jsonResponse({ success: true });
});
