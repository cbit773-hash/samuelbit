// ============================================================
// INVESPRO — Payment Orchestrator
// Conecta NOWPayments (o Stripe) con el sistema de Wallet
// ============================================================

import { createInvoice, createDirectPayment, getPaymentStatus, RECOMMENDED_CRYPTOS } from './nowpayments';
import { createDepositRequest, createWithdrawalRequest, getMyWallet } from '../supabase/services/wallet.service';
import { supabase } from '../supabase/client';

export type PaymentGateway = 'nowpayments' | 'stripe' | 'manual';

// ─── Deposit Flow ────────────────────────────────────────────

/**
 * Flujo completo de depósito crypto:
 * 1. Crea transacción en Supabase (status: processing)
 * 2. Crea invoice en NOWPayments
 * 3. Actualiza la transacción con el external_id y URL
 * 4. Retorna la URL de pago para redirigir al cliente
 */
export async function initiateCryptoDeposit(params: {
  amount: number;
  cryptoCurrency?: string;
}): Promise<{ paymentUrl: string; transactionId: string } | { error: string }> {
  const { amount, cryptoCurrency } = params;

  // Validaciones
  if (amount < 10) return { error: 'El monto mínimo es $10 USD' };
  if (amount > 100000) return { error: 'El monto máximo es $100,000 USD' };

  // 1. Crear transacción en Supabase
  const tx = await createDepositRequest({
    amount,
    payment_method: cryptoCurrency ? `crypto_${cryptoCurrency}` : 'crypto_usdt',
    gateway: 'nowpayments',
  });

  if (!tx) return { error: 'Error al crear la transacción. Intenta de nuevo.' };

  // 2. Crear invoice en NOWPayments
  const invoice = await createInvoice({
    amount,
    orderId: tx.id,
    description: `InvestPRO Deposit #${tx.id.slice(0, 8)} - $${amount} USD`,
  });

  if (!invoice) {
    // Marcar transacción como fallida
    await supabase.from('transactions').update({ status: 'failed', notes: 'NOWPayments invoice creation failed' }).eq('id', tx.id);
    return { error: 'Error al conectar con el procesador de pagos. Intenta de nuevo.' };
  }

  // 3. Actualizar transacción con datos de NOWPayments
  await supabase.from('transactions').update({
    external_id: String(invoice.id),
    external_url: invoice.invoice_url,
    status: 'processing',
  }).eq('id', tx.id);

  // 4. Retornar URL de pago
  return {
    paymentUrl: invoice.invoice_url,
    transactionId: tx.id,
  };
}

/**
 * Flujo de depósito directo (sin hosted page):
 * Genera una dirección crypto específica para el pago.
 */
export async function initiateDirectCryptoDeposit(params: {
  amount: number;
  cryptoCurrency: string;
}): Promise<{
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  transactionId: string;
  expiresAt: string;
} | { error: string }> {
  const { amount, cryptoCurrency } = params;

  if (amount < 10) return { error: 'El monto mínimo es $10 USD' };

  const tx = await createDepositRequest({
    amount,
    payment_method: `crypto_${cryptoCurrency}`,
    gateway: 'nowpayments',
  });

  if (!tx) return { error: 'Error al crear la transacción.' };

  const payment = await createDirectPayment({
    amount,
    cryptoCurrency,
    orderId: tx.id,
  });

  if (!payment) {
    await supabase.from('transactions').update({ status: 'failed' }).eq('id', tx.id);
    return { error: 'Error al generar dirección de pago.' };
  }

  await supabase.from('transactions').update({
    external_id: payment.payment_id,
    crypto_address: payment.pay_address,
    crypto_network: cryptoCurrency.toUpperCase(),
    status: 'processing',
  }).eq('id', tx.id);

  return {
    payAddress: payment.pay_address,
    payAmount: payment.pay_amount,
    payCurrency: payment.pay_currency,
    transactionId: tx.id,
    expiresAt: payment.expiration_estimate_date,
  };
}

/**
 * Flujo de depósito manual (transferencia bancaria):
 * Solo crea la transacción en Supabase con status pending.
 * El CHIEF la aprueba manualmente.
 */
export async function initiateManualDeposit(params: {
  amount: number;
  notes?: string;
}): Promise<{ transactionId: string } | { error: string }> {
  const tx = await createDepositRequest({
    amount: params.amount,
    payment_method: 'bank_transfer',
    gateway: 'manual',
    notes: params.notes || 'Depósito por transferencia bancaria — pendiente de verificación',
  });

  if (!tx) return { error: 'Error al registrar el depósito.' };
  return { transactionId: tx.id };
}

// ─── Withdrawal Flow ─────────────────────────────────────────

/**
 * Solicitar retiro (requiere aprobación del CHIEF).
 */
export async function initiateWithdrawal(params: {
  amount: number;
  method: 'crypto' | 'bank';
  cryptoAddress?: string;
  cryptoNetwork?: string;
  notes?: string;
}): Promise<{ transactionId: string } | { error: string }> {
  const wallet = await getMyWallet();

  if (!wallet) return { error: 'No se encontró tu billetera.' };
  if (wallet.is_frozen) return { error: 'Tu billetera está congelada. Contacta a soporte.' };
  if (wallet.balance < params.amount) return { error: `Saldo insuficiente. Balance: $${wallet.balance} USD` };
  if (params.amount < 50) return { error: 'El retiro mínimo es $50 USD' };

  const tx = await createWithdrawalRequest({
    amount: params.amount,
    payment_method: params.method === 'crypto' ? 'crypto_usdt' : 'bank_transfer',
    crypto_address: params.cryptoAddress,
    crypto_network: params.cryptoNetwork,
    notes: params.notes,
  });

  if (!tx) return { error: 'Error al crear la solicitud de retiro.' };
  return { transactionId: tx.id };
}

// ─── Status Checking ─────────────────────────────────────────

/**
 * Verificar el estado de un pago en NOWPayments
 * y actualizar la transacción en Supabase.
 */
export async function syncPaymentStatus(transactionId: string): Promise<string> {
  // Get transaction from Supabase
  const { data: tx } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (!tx || !tx.external_id) return 'unknown';

  // Check status in NOWPayments
  const status = await getPaymentStatus(tx.external_id);
  if (!status) return tx.status;

  // Map NOWPayments status to our status
  let newStatus = tx.status;
  if (status.payment_status === 'finished' || status.payment_status === 'confirmed') {
    newStatus = 'completed';
  } else if (status.payment_status === 'failed' || status.payment_status === 'expired') {
    newStatus = 'failed';
  } else if (status.payment_status === 'waiting' || status.payment_status === 'confirming') {
    newStatus = 'processing';
  }

  // Update in Supabase if status changed
  if (newStatus !== tx.status) {
    const updates: Record<string, any> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      // Auto-approve crypto payments — update wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', tx.wallet_id)
        .single();

      if (wallet) {
        await supabase.from('wallets').update({
          balance: Number(wallet.balance) + Number(tx.net_amount),
          total_deposited: Number(wallet.total_deposited) + Number(tx.net_amount),
        }).eq('id', tx.wallet_id);
      }
    }
    await supabase.from('transactions').update(updates).eq('id', transactionId);
  }

  return newStatus;
}

// ─── Re-export recommended cryptos for UI ────────────────────
export { RECOMMENDED_CRYPTOS };
