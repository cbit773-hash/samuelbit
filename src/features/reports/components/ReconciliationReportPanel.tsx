import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import type { ReconciliationSnapshot } from '../../../core/reports/reconciliation-report';
import {
  buildReconciliationSummary,
  exportTransactionsCsv,
  exportDepositsCsv,
  exportReconciliationPdf,
} from '../../../core/reports/reconciliation-report';

interface Props {
  snapshot: ReconciliationSnapshot;
}

export function ReconciliationReportPanel({ snapshot }: Props) {
  const lines = buildReconciliationSummary(snapshot);

  return (
    <div className="bg-surface-alt border border-border rounded-2xl p-6 shadow-xl animate-fade-in">
      <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
        <FileText className="text-pink-500" /> Reporte de conciliación (EOD)
      </h3>
      <p className="text-muted text-sm mb-6">Datos en vivo desde Supabase — exportar para auditoría financiera.</p>

      <div className="bg-surface-inset p-6 rounded-xl border border-border mb-6 text-sm text-foreground font-mono leading-relaxed space-y-1">
        {lines.map((line) => (
          <p key={line} className="text-pink-400/90">
            {'> '}
            {line}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => exportTransactionsCsv(snapshot)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-foreground font-bold px-5 py-3 rounded-xl text-sm"
        >
          <FileSpreadsheet size={18} /> CSV Transacciones
        </button>
        <button
          type="button"
          onClick={() => exportDepositsCsv(snapshot)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-foreground font-bold px-5 py-3 rounded-xl text-sm"
        >
          <FileSpreadsheet size={18} /> CSV Depósitos CRM
        </button>
        <button
          type="button"
          onClick={() => exportReconciliationPdf(snapshot)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-foreground font-bold px-5 py-3 rounded-xl text-sm"
        >
          <Download size={18} /> PDF / Imprimir
        </button>
      </div>
      <p className="text-muted text-xs mt-4">
        PDF abre vista de impresión del navegador — elige &quot;Guardar como PDF&quot;.
      </p>
    </div>
  );
}
