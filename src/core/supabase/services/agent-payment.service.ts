// ============================================================
// INVESPRO — Cobro rápido del agente (depósito para cliente)
// ============================================================
import { supabase } from '../client';

interface CreateDepositForClientBody {
  client_id: string;
  amount: number;
  lead_id?: string;
  notes?: string;
  method?: 'crypto_invoice';
}

export async function createDepositLinkForClient(
  params: CreateDepositForClientBody,
): Promise<{ paymentUrl: string; transactionId: string } | { error: string }> {
  const { data, error } = await supabase.functions.invoke('create-deposit-for-client', {
    body: {
      client_id: params.client_id,
      amount: params.amount,
      lead_id: params.lead_id,
      notes: params.notes,
      method: params.method ?? 'crypto_invoice',
    },
  });

  if (error) {
    return { error: error.message ?? 'Error al generar link de pago' };
  }

  const body = data as { paymentUrl?: string; transactionId?: string; error?: string };
  if (body?.error) return { error: body.error };
  if (!body?.paymentUrl || !body?.transactionId) {
    return { error: 'Respuesta inválida del servidor' };
  }

  return { paymentUrl: body.paymentUrl, transactionId: body.transactionId };
}
