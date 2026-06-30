// ============================================================
// INVESPRO — Payment Orchestrator (client → Edge Functions)
// NOWPayments API key lives server-side only.
// ============================================================

import { supabase } from '../supabase/client';
import { getMyWallet, getMyWalletOrCreate, getMyTransactions } from '../supabase/services/wallet.service';
import { RECOMMENDED_CRYPTOS } from './nowpayments';

export type PaymentGateway = 'nowpayments' | 'stripe' | 'manual' | 'manual_bank';
export type DepositMethod = 'crypto_invoice' | 'crypto_direct' | 'manual';

interface EdgeError {
  error?: string;
}

function mapEdgeErrorMessage(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('nowpayments_api_key not configured')) {
    return 'Pagos crypto no configurados en el servidor. Usa transferencia bancaria o contacta a soporte.';
  }
  if (lower.includes('unauthorized') || lower.includes('invalid session')) {
    return 'Sesión expirada. Vuelve a iniciar sesión.';
  }
  if (lower.includes('amount must be between')) {
    return 'El monto debe estar entre $10 y $100,000 USD.';
  }
  if (lower.includes('non-2xx') || lower.includes('edge function')) {
    return 'No se pudo procesar el depósito. Revisa la configuración de pagos o usa transferencia manual.';
  }
  return raw;
}

async function parseInvokeError(error: {
  message?: string;
  context?: Response;
}): Promise<string> {
  let detail = error.message ?? 'Error de conexión con el servidor';

  if (error.context) {
    try {
      const bodyText =
        typeof error.context.text === 'function' ? await error.context.text() : '';
      if (bodyText) {
        try {
          const body = JSON.parse(bodyText) as EdgeError;
          if (body?.error) detail = body.error;
        } catch {
          detail = bodyText.slice(0, 300);
        }
      } else if (typeof error.context.json === 'function') {
        const body = (await error.context.json()) as EdgeError;
        if (body?.error) detail = body.error;
      }
    } catch {
      // ignore parse failure
    }
  }

  return mapEdgeErrorMessage(detail);
}

async function invokeFunction<T>(name: string, body: Record<string, unknown>): Promise<T | { error: string }> {
  const { data, error } = await supabase.functions.invoke(name, { body });

  if (error) {
    console.error(`[${name}]`, error);
    return { error: await parseInvokeError(error) };
  }

  const payload = data as T & EdgeError;
  if (payload && typeof payload === 'object' && 'error' in payload && payload.error) {
    return { error: mapEdgeErrorMessage(String(payload.error)) };
  }

  return payload as T;
}

// ─── Deposit Flow ────────────────────────────────────────────

export async function initiateCryptoDeposit(params: {
  amount: number;
}): Promise<{ paymentUrl: string; transactionId: string } | { error: string }> {
  const { amount } = params;
  if (amount < 10) return { error: 'El monto mínimo es $10 USD' };
  if (amount > 100000) return { error: 'El monto máximo es $100,000 USD' };

  const result = await invokeFunction<{ paymentUrl: string; transactionId: string }>('create-deposit', {
    amount,
    method: 'crypto_invoice',
  });

  if ('error' in result) return result;
  return result;
}

export async function initiateDirectCryptoDeposit(params: {
  amount: number;
  cryptoCurrency: string;
}): Promise<{
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  transactionId: string;
  expiresAt: string | null;
} | { error: string }> {
  const { amount, cryptoCurrency } = params;
  if (amount < 10) return { error: 'El monto mínimo es $10 USD' };

  const result = await invokeFunction<{
    payAddress: string;
    payAmount: number;
    payCurrency: string;
    transactionId: string;
    expiresAt: string | null;
  }>('create-deposit', {
    amount,
    method: 'crypto_direct',
    crypto_currency: cryptoCurrency,
  });

  if ('error' in result) return result;
  return result;
}

export async function initiateManualDeposit(params: {
  amount: number;
  notes?: string;
  companyBankId?: string;
  clientBank?: string;
  cciOrigin?: string;
  amountPenDeclared?: number;
  receiptPath?: string;
  gateway?: 'manual' | 'manual_bank';
}): Promise<{ transactionId: string } | { error: string }> {
  const gateway = params.gateway ?? 'manual_bank';
  const { data, error } = await supabase.rpc('create_deposit_transaction', {
    p_amount: params.amount,
    p_payment_method: 'bank_transfer',
    p_gateway: gateway,
    p_notes: params.notes ?? null,
    p_company_bank_id: params.companyBankId ?? null,
    p_client_bank: params.clientBank ?? null,
    p_cci_origin: params.cciOrigin ?? null,
    p_amount_pen_declared: params.amountPenDeclared ?? null,
    p_receipt_path: params.receiptPath ?? null,
  });

  if (error) {
    console.error('[initiateManualDeposit]', error);
    return { error: mapEdgeErrorMessage(error.message) };
  }

  const txId = (data as { transaction_id?: string })?.transaction_id;
  if (!txId) return { error: 'No se pudo crear la transacción' };
  return { transactionId: txId };
}

// ─── Withdrawal Flow ─────────────────────────────────────────

export async function initiateWithdrawal(params: {
  amount: number;
  method: 'crypto' | 'bank';
  cryptoAddress?: string;
  cryptoNetwork?: string;
  notes?: string;
  withdrawalBank?: string;
  withdrawalCci?: string;
  withdrawalHolder?: string;
}): Promise<{ transactionId: string; newBalance?: number } | { error: string }> {
  const wallet = await getMyWalletOrCreate();
  if (!wallet) return { error: 'No se encontró tu billetera.' };
  if (wallet.is_frozen) return { error: 'Tu billetera está congelada. Contacta a soporte.' };
  if (wallet.balance < params.amount) {
    return { error: `Saldo insuficiente. Balance: $${wallet.balance} USD` };
  }
  if (params.amount < 50) return { error: 'El retiro mínimo es $50 USD' };

  const result = await invokeFunction<{ transactionId: string; newBalance?: number }>('request-withdrawal', {
    amount: params.amount,
    method: params.method,
    crypto_address: params.cryptoAddress,
    crypto_network: params.cryptoNetwork,
    notes: params.notes,
    withdrawal_bank: params.withdrawalBank,
    withdrawal_cci: params.withdrawalCci,
    withdrawal_holder: params.withdrawalHolder,
  });

  if ('error' in result) return result;

  return {
    transactionId: result.transactionId,
    newBalance: result.newBalance,
  };
}

// ─── Status (read-only — acreditación vía webhook IPN) ───────

export async function getTransactionStatus(transactionId: string): Promise<string> {
  const { data } = await supabase
    .from('transactions')
    .select('status')
    .eq('id', transactionId)
    .single();

  return data?.status ?? 'unknown';
}

/** @deprecated La acreditación es automática vía webhook. Usar getTransactionStatus. */
export async function syncPaymentStatus(transactionId: string): Promise<string> {
  return getTransactionStatus(transactionId);
}

export async function pollTransactionUntilComplete(
  transactionId: string,
  maxAttempts = 30,
  intervalMs = 4000
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await getTransactionStatus(transactionId);
    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      return status;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return getTransactionStatus(transactionId);
}

export { RECOMMENDED_CRYPTOS, getMyWallet, getMyTransactions };
