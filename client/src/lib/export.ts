/**
 * Export data array to CSV and trigger download.
 */
export function exportToCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Open print dialog for PDF export via browser print.
 */
export function exportToPdf(title: string, content: string): void {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`<html><head><title>${title}</title></head><body><pre>${content}</pre></body></html>`);
  win.document.close();
  win.print();
}
