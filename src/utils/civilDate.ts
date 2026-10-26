/**
 * Civil dates (`YYYY-MM-DD`): no time, no zone.
 *
 * Coupon expiry and banner windows are civil dates the admin picks in Brasília. They compare
 * lexicographically, which is monotonic by construction. `civilToday()` reads the date in Brasília
 * explicitly, so a server running in UTC gets the same answer as a browser in Brasília.
 */
import { TIME_ZONE } from '@/constants/locale';

const DAY_MS = 24 * 60 * 60 * 1000;

const civilFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const civilToday = (now: Date = new Date()): string => civilFormatter.format(now);

/** Whole days elapsed from `isoStart` to `now` (default: now). */
export const daysSince = (isoStart: string, now: Date = new Date()): number =>
  Math.floor((now.getTime() - new Date(isoStart).getTime()) / DAY_MS);

/** Whole days from `now` until `isoDate`; negative when already past. */
export const daysUntil = (isoDate: string, now: Date = new Date()): number =>
  Math.floor((new Date(isoDate).getTime() - now.getTime()) / DAY_MS);

export const addMonths = (iso: string, months: number): Date => {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
};
