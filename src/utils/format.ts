/**
 * Formatting in one place. Every formatter pins the locale and the Brasília time zone, so the server
 * and the browser produce the same string (no hydration mismatch).
 */
import { LOCALE, TIME_ZONE } from '@/constants/locale';

const BRL = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' });

export const formatBRL = (value: number) => BRL.format(value);

const BRL_WHOLE = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
/** Whole reais, for KPI tiles where cents are noise. */
export const formatBRLWhole = (value: number) => BRL_WHOLE.format(value);

/** Takes `YYYY-MM-DD` or a full ISO string and returns `DD/MM/AAAA` (date part as written). */
export const formatDate = (iso: string) => {
  if (!iso) return '—';
  const [year, month, day] = iso.slice(0, 10).split('-');
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
};

/** `DD/MM/AAAA` of an instant, read in Brasília (never by slicing `toISOString()`, which is UTC). */
export const formatDateFromDate = (value: Date | number) => {
  const d = typeof value === 'number' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return dateFormatter.format(d);
};

/** `DD/MM/AAAA às HH:MM` from an ISO instant, in Brasília. */
export const formatDateTime = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${dateFormatter.format(d)} às ${timeFormatter.format(d)}`;
};

/** Masks a CPF (000.000.000-00) or CNPJ (00.000.000/0000-00). */
export const formatDocument = (value: string) => {
  const d = value.replace(/\D/g, '');
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  return value;
};

export const onlyDigits = (value: string) => value.replace(/\D/g, '');
