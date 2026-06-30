export function mapCryptoToPaymentMethod(crypto: string): { paymentMethod: string } {
  const map: Record<string, string> = {
    usdttrc20: 'crypto_usdt',
    btc: 'crypto_btc',
    eth: 'crypto_eth',
  };
  return { paymentMethod: map[crypto.toLowerCase()] ?? 'crypto_usdt' };
}

export async function createInvoice(_params: {
  amount: number;
  orderId: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; invoice_url: string }> {
  throw new Error('NOWPayments not configured');
}
