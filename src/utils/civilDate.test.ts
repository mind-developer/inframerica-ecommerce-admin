import { addMonths, civilToday, daysSince, daysUntil } from './civilDate';

describe('civilToday', () => {
  it('returns the Brasília date as YYYY-MM-DD', () => {
    expect(civilToday(new Date('2026-06-15T12:00:00.000Z'))).toBe('2026-06-15');
  });

  // The server may run in UTC: at 22h in Brasília the UTC date is already tomorrow.
  it('uses Brasília time, not UTC, near midnight', () => {
    expect(civilToday(new Date('2026-06-16T01:00:00.000Z'))).toBe('2026-06-15');
  });
});

describe('daysSince / daysUntil', () => {
  const now = new Date('2026-06-15T12:00:00.000Z');

  it('counts whole days elapsed', () => {
    expect(daysSince('2026-06-10T12:00:00.000Z', now)).toBe(5);
    expect(daysSince('2026-06-15T13:00:00.000Z', now)).toBe(-1);
  });

  it('counts whole days remaining, negative when past', () => {
    expect(daysUntil('2026-06-20T12:00:00.000Z', now)).toBe(5);
    expect(daysUntil('2026-06-14T12:00:00.000Z', now)).toBe(-1);
  });
});

describe('addMonths', () => {
  it('adds calendar months to an ISO date', () => {
    expect(addMonths('2026-01-15T12:00:00.000Z', 3).toISOString()).toBe('2026-04-15T12:00:00.000Z');
  });
});
