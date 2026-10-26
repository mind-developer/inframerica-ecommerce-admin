/** Downloads text generated in memory. CSVs get a BOM so Excel reads them as UTF-8. */
export function downloadText(filename: string, content: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const downloadCsv = (filename: string, csv: string) =>
  downloadText(filename, `﻿${csv}`, 'text/csv;charset=utf-8;');

/** Quotes a CSV cell when needed (separator, quotes or line breaks). */
export const csvCell = (value: string | number | null | undefined, separator = ',') => {
  const text = value === null || value === undefined ? '' : String(value);
  return new RegExp(`[${separator}"\\n]`).test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
