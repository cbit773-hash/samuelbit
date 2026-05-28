/** Escapa valor para CSV */
function csvCell(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => row.map(csvCell).join(',')),
  ];
  return '\uFEFF' + lines.join('\r\n');
}

export function downloadTextFile(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  downloadTextFile(filename, rowsToCsv(headers, rows));
}

export function openPrintablePdf(title: string, bodyHtml: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body{font-family:system-ui,sans-serif;padding:32px;color:#111;max-width:900px;margin:0 auto}
  h1{font-size:22px;border-bottom:2px solid #06b6d4;padding-bottom:8px}
  table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}
  th,td{border:1px solid #ddd;padding:8px;text-align:left}
  th{background:#f0f9ff}
  .meta{color:#666;font-size:13px;margin-bottom:24px}
  @media print{body{padding:16px}}
</style></head><body>
<h1>${title}</h1>
<div class="meta">InvestPRO ÔÇö Generado ${new Date().toLocaleString('es-CO')}</div>
${bodyHtml}
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Permite ventanas emergentes para exportar PDF.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}
