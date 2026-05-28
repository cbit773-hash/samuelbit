import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { createUserClient, createAdminClient } from '../_shared/supabase-admin.ts';
import { createInvoice, mapCryptoToPaymentMethod } from '../_shared/nowpayments-client.ts';
import { notifyDepositPending } from '../_shared/notifications.ts';

interface Body {
  client_id: string;
  amount: number;
  lead_id?: string;
  notes?: string;
  method?: 'crypto_invoice';
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object') {
    const o = err as Record<string, unknown>;
    if (typeof o.message === 'string') return o.message;
    if (typeof o.error === 'string') return o.error;
  }
  return 'Unknown error';
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
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { client_id, amount, lead_id, notes } = body;
  if (!client_id || !amount || amount < 10 || amount > 100000) {
    return jsonResponse({ error: 'client_id and amount (10-100000) required' }, 400);
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
    .single();

  if (profile?.role !== 'AGENT') {
    return jsonResponse({ error: 'Only agents can create client deposit links' }, 403);
  }

  const appUrl = Deno.env.get('APP_URL') ?? Deno.env.get('VITE_APP_URL') ?? 'http://localhost:5173';
  const admin = createAdminClient();
  let transactionId: string | null = null;

  try {
    const { paymentMethod } = mapCryptoToPaymentMethod('usdttrc20');

    const { data: txData, error: txError } = await userClient.rpc('agent_create_deposit_transaction', {
      p_client_id: client_id,
      p_amount: amount,
      p_payment_method: paymentMethod,
      p_gateway: 'nowpayments',
      p_notes: notes ?? 'Depósito iniciado por agente (cobro rápido)',
      p_lead_id: lead_id ?? null,
    });

    if (txError) throw txError;

    transactionId = (txData as { transaction_id: string }).transaction_id;

    if (!Deno.env.get('NOWPAYMENTS_API_KEY')) {
      return jsonResponse({ error: 'NOWPAYMENTS_API_KEY not configured' }, 503);
    }

    const invoice = await createInvoice({
      amount,
      orderId: transactionId,
      description: `InvestPRO Deposit #${transactionId.slice(0, 8)} - $${amount} USD`,
      successUrl: `${appUrl}/dashboard/account?tab=depositar&deposit=success`,
      cancelUrl: `${appUrl}/dashboard/account?tab=depositar&deposit=cancelled`,
    });

    await admin.rpc('attach_nowpayments_invoice', {
      p_tx_id: transactionId,
      p_invoice_id: String(invoice.id),
      p_invoice_url: invoice.invoice_url,
    });

    try {
      await notifyDepositPending(admin, appUrl, client_id, amount, transactionId);
    } catch (notifyErr) {
      console.warn('[create-deposit-for-client] notify', extractErrorMessage(notifyErr));
    }

    return jsonResponse({
      paymentUrl: invoice.invoice_url,
      transactionId,
    });
  } catch (err) {
    const message = extractErrorMessage(err);
    console.error('[create-deposit-for-client]', message);

    if (transactionId) {
      await admin.rpc('mark_transaction_failed', {
        p_tx_id: transactionId,
        p_reason: message,
      }).catch(() => {});
    }

    return jsonResponse({ error: message }, 500);
  }
});
