// ============================================================
// INVESPRO — Integración NOWPayments API
// Documentación: https://nowpayments.io/documentation
// ============================================================

const NOWPAYMENTS_API = 'https://api.nowpayments.io/v1';

function getApiKey(): string {
  const key = import.meta.env.VITE_NOWPAYMENTS_API_KEY || '';
  if (!key) console.warn('[NOWPayments] API key no configurada en .env');
  return key;
}

function headers() {
  return {
    'x-api-key': getApiKey(),
    'Content-Type': 'application/json',
  };
}

// ─── Types ───────────────────────────────────────────────────

export interface NowPaymentsInvoice {
  id: string;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  invoice_url: string;
  success_url: string;
  cancel_url: string;
  created_at: string;
  updated_at: string;
  is_fixed_rate: boolean;
  is_fee_paid_by_user: boolean;
}

export interface NowPaymentsStatus {
  payment_id: number;
  invoice_id: number;
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired';
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  actually_paid: number;
  outcome_amount: number;
  outcome_currency: string;
  created_at: string;
  updated_at: string;
}

export interface NowPaymentsCurrency {
  id: number;
  code: string;
  name: string;
  network: string;
  is_fiat: boolean;
}

// ─── API Methods ─────────────────────────────────────────────

/** Verificar que la API está activa */
export async function checkApiStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${NOWPAYMENTS_API}/status`);
    const data = await res.json();
    return data.message === 'OK';
  } catch {
    return false;
  }
}

/** Obtener monedas disponibles */
export async function getAvailableCurrencies(): Promise<string[]> {
  try {
    const res = await fetch(`${NOWPAYMENTS_API}/currencies`, { headers: headers() });
    const data = await res.json();
    return data.currencies || [];
  } catch (err) {
    console.error('[NOWPayments] Error getting currencies:', err);
    return [];
  }
}

/** Obtener precio estimado de conversión */
export async function getEstimatedPrice(
  amountUsd: number,
  cryptoCurrency: string = 'btc'
): Promise<{ estimated_amount: number; currency_from: string; currency_to: string } | null> {
  try {
    const res = await fetch(
      `${NOWPAYMENTS_API}/estimate?amount=${amountUsd}&currency_from=usd&currency_to=${cryptoCurrency}`,
      { headers: headers() }
    );
    return await res.json();
  } catch (err) {
    console.error('[NOWPayments] Error estimating price:', err);
    return null;
  }
}

/** Obtener monto mínimo de pago para una moneda */
export async function getMinimumPayment(cryptoCurrency: string = 'btc'): Promise<number> {
  try {
    const res = await fetch(
      `${NOWPAYMENTS_API}/min-amount?currency_from=${cryptoCurrency}&currency_to=usd`,
      { headers: headers() }
    );
    const data = await res.json();
    return data.min_amount || 0;
  } catch {
    return 0;
  }
}

/**
 * Crear un invoice de pago (método principal).
 * Genera una URL hosted donde el cliente selecciona su crypto y paga.
 */
export async function createInvoice(params: {
  amount: number;           // Monto en USD
  orderId: string;          // ID del transaction en Supabase
  description?: string;     // Descripción del pago
  successUrl?: string;      // URL de redirección post-pago
  cancelUrl?: string;       // URL si cancela
}): Promise<NowPaymentsInvoice | null> {
  try {
    const body = {
      price_amount: params.amount,
      price_currency: 'usd',
      order_id: params.orderId,
      order_description: params.description || `InvestPRO Deposit - $${params.amount} USD`,
      success_url: params.successUrl || `${window.location.origin}/dashboard/client?deposit=success`,
      cancel_url: params.cancelUrl || `${window.location.origin}/dashboard/client?deposit=cancelled`,
      is_fixed_rate: true,
      is_fee_paid_by_user: false,
    };

    const res = await fetch(`${NOWPAYMENTS_API}/invoice`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('[NOWPayments] Invoice error:', error);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('[NOWPayments] Error creating invoice:', err);
    return null;
  }
}

/**
 * Crear un pago directo (alternativa al invoice).
 * Genera una dirección de pago para una crypto específica.
 */
export async function createDirectPayment(params: {
  amount: number;
  cryptoCurrency: string;   // 'btc', 'eth', 'usdttrc20', etc.
  orderId: string;
}): Promise<{
  payment_id: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  expiration_estimate_date: string;
} | null> {
  try {
    const body = {
      price_amount: params.amount,
      price_currency: 'usd',
      pay_currency: params.cryptoCurrency,
      order_id: params.orderId,
      order_description: `InvestPRO Deposit - $${params.amount} USD`,
      is_fixed_rate: true,
    };

    const res = await fetch(`${NOWPAYMENTS_API}/payment`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('[NOWPayments] Payment error:', error);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('[NOWPayments] Error creating payment:', err);
    return null;
  }
}

/** Consultar estado de un pago por payment_id */
export async function getPaymentStatus(paymentId: string): Promise<NowPaymentsStatus | null> {
  try {
    const res = await fetch(`${NOWPAYMENTS_API}/payment/${paymentId}`, {
      headers: headers(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Monedas Recomendadas (filtro para UI) ───────────────────

export const RECOMMENDED_CRYPTOS = [
  { code: 'usdttrc20', name: 'USDT (TRC20)', icon: '💲', network: 'Tron', popular: true },
  { code: 'btc', name: 'Bitcoin', icon: '₿', network: 'Bitcoin', popular: true },
  { code: 'eth', name: 'Ethereum', icon: 'Ξ', network: 'Ethereum', popular: true },
  { code: 'usdterc20', name: 'USDT (ERC20)', icon: '💲', network: 'Ethereum', popular: false },
  { code: 'usdc', name: 'USDC', icon: '💵', network: 'Ethereum', popular: false },
  { code: 'ltc', name: 'Litecoin', icon: 'Ł', network: 'Litecoin', popular: false },
  { code: 'sol', name: 'Solana', icon: '◎', network: 'Solana', popular: false },
  { code: 'bnbbsc', name: 'BNB', icon: '🔶', network: 'BSC', popular: false },
];
