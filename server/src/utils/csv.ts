export type CsvValue = string | number | boolean | Date | null | undefined;

// UTF-8 byte order mark so Excel detects the encoding of non-English text
export const CSV_BOM = '﻿';

// Leading characters that spreadsheet apps interpret as a formula (CSV injection)
const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'];

// Convert a value to text and neutralise formula injection by prefixing a single quote
export function sanitizeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== 'string') return String(value);

  return FORMULA_TRIGGERS.includes(value.charAt(0)) ? `'${value}` : value;
}

// RFC 4180: quote fields containing commas, quotes or line breaks, doubling inner quotes
export function escapeCsvField(field: string): string {
  if (/[",\r\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function toCsv(headers: string[], rows: CsvValue[][]): string {
  const lines = [headers, ...rows].map((row) =>
    row.map((value) => escapeCsvField(sanitizeCsvValue(value))).join(',')
  );
  return CSV_BOM + lines.join('\r\n') + '\r\n';
}
