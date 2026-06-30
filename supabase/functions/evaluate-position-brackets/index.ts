import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient } from '../_shared/supabase-admin.ts';

interface Body {
  symbol: string;
  price: number;
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authHeader = req.headers.get('Authorization');
  const isService = authHeader === `Bearer ${serviceKey}`;

  if (!isService) {
    return jsonResponse({ error: 'Service role required' }, 403);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const { symbol, price } = body;
  if (!symbol || !price || price <= 0) {
    return jsonResponse({ error: 'symbol and price required' }, 400);
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc('evaluate_position_brackets', {
    p_symbol: symbol,
    p_price: price,
  });

  if (error) {
    console.error('[evaluate-position-brackets]', error.message);
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data ?? { closed: 0 });
});
