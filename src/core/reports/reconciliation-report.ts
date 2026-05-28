import type { Deposit, Lead, Profile } from '../supabase/database.types';
import type { Transaction } from '../supabase/services/wallet.service';
import { downloadCsv, openPrintablePdf } from '../../shared/utils/export-reports';

export interface ReconciliationSnapshot {
  generatedAt: string;
  transactions: Transaction[];
  deposits: Deposit[];
  kpis: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    totalVolume: number;
    ftdCount: number;
    retentionVolume: number;
  };
  profiles: Profile[];
  leads: Lead[];
}

export function buildReconciliationSummary(s: ReconciliationSnapshot): string[] {
  const txCompleted = s.transactions.filter((t) => t.status === 'completed');
  const depositsSum = txCompleted
    .filter((t) => t.type === 'deposit')
    .reduce((a, t) => a + Number(t.net_amount ?? t.amount), 0);
  const withdrawalsSum = txCompleted
    .filter((t) => t.type === 'withdrawal')
    .reduce((a, t) => a + Number(t.amount), 0);

  return [
    `Fecha: ${s.generatedAt}`,
    `Transacciones wallet (total): ${s.transactions.length}`,
    `Dep├│sitos CRM (total): ${s.deposits.length}`,
    `Dep├│sitos CRM aprobados: ${s.kpis.approved} ÔÇö Volumen $${s.kpis.totalVolume.toLocaleString()}`,
    `FTDs CRM: ${s.kpis.ftdCount} | Retenci├│n $${s.kpis.retentionVolume.toLocaleString()}`,
    `Wallet ÔÇö dep├│sitos completados: $${depositsSum.toFixed(2)} | retiros: $${withdrawalsSum.toFixed(2)}`,
    `Personal: ${s.profiles.length} perfiles | Leads CRM: ${s.leads.length}`,
  ];
}

export function exportTransactionsCsv(s: ReconciliationSnapshot) {
  const headers = [
    'id', 'client_id', 'type', 'amount', 'net_amount', 'status', 'payment_method',
    'gateway', 'created_at', 'completed_at',
  ];
  const rows = s.transactions.map((t) => [
    t.id,
    t.client_id,
    t.type,
    t.amount,
    t.net_amount,
    t.status,
    t.payment_method,
    t.gateway ?? '',
    t.created_at,
    t.completed_at ?? '',
  ]);
  downloadCsv(`investpro-transacciones-${dateSlug()}.csv`, headers, rows);
}

export function exportDepositsCsv(s: ReconciliationSnapshot) {
  const headers = ['id', 'client_id', 'agent_id', 'amount', 'type', 'status', 'created_at', 'notes'];
  const rows = s.deposits.map((d) => [
    d.id,
    d.client_id,
    d.agent_id,
    d.amount,
    d.type,
    d.status,
    d.created_at,
    d.notes ?? '',
  ]);
  downloadCsv(`investpro-depositos-crm-${dateSlug()}.csv`, headers, rows);
}

export function exportReconciliationPdf(s: ReconciliationSnapshot) {
  const summary = buildReconciliationSummary(s);
  const txRows = s.transactions
    .slice(0, 50)
    .map(
      (t) =>
        `<tr><td>${t.id.slice(0, 8)}</td><td>${t.type}</td><td>${t.status}</td><td>$${Number(t.amount).toFixed(2)}</td><td>${t.gateway ?? '-'}</td><td>${new Date(t.created_at).toLocaleDateString()}</td></tr>`
    )
    .join('');

  const body = `
    <h2>Resumen ejecutivo</h2>
    <ul>${summary.map((l) => `<li>${l}</li>`).join('')}</ul>
    <h2>├Ültimas transacciones (m├íx. 50)</h2>
    <table><thead><tr><th>ID</th><th>Tipo</th><th>Estado</th><th>Monto</th><th>Gateway</th><th>Fecha</th></tr></thead>
    <tbody>${txRows || '<tr><td colspan="6">Sin datos</td></tr>'}</tbody></table>
    <p style="font-size:11px;color:#888">Use CSV para exportaci├│n completa.</p>
  `;

  openPrintablePdf(`Conciliaci├│n InvestPRO ÔÇö ${dateSlug()}`, body);
}

function dateSlug() {
  return new Date().toISOString().slice(0, 10);
}
