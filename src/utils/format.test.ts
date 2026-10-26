import {
  formatBRL,
  formatBRLWhole,
  formatDate,
  formatDateFromDate,
  formatDateTime,
  formatDocument,
  onlyDigits,
} from './format';

const plain = (s: string) => s.replace(/ /g, ' ');

describe('formatBRLWhole', () => {
  it('rounds to whole reais for KPI tiles', () => {
    expect(plain(formatBRLWhole(18675.4))).toBe('R$ 18.675');
  });
});

describe('formatBRL', () => {
  it('formats reais with two decimals', () => {
    expect(plain(formatBRL(1234.5))).toBe('R$ 1.234,50');
  });

  it('formats zero and negatives', () => {
    expect(plain(formatBRL(0))).toBe('R$ 0,00');
    expect(plain(formatBRL(-10))).toContain('10,00');
  });

  it('rounds to two decimals', () => {
    expect(plain(formatBRL(1.005))).toBe('R$ 1,01');
  });
});

describe('formatDate', () => {
  it('formats a civil date YYYY-MM-DD', () => {
    expect(formatDate('2026-10-20')).toBe('20/10/2026');
  });

  it('ignores the time of a full ISO string', () => {
    expect(formatDate('2026-01-05T23:30:00.000Z')).toBe('05/01/2026');
  });

  it('returns a dash for an empty string', () => {
    expect(formatDate('')).toBe('—');
  });

  it('returns the raw input when it does not look like a date', () => {
    expect(formatDate('sem data')).toBe('sem data');
  });
});

describe('formatDateFromDate', () => {
  it('formats a Date in Brasília time', () => {
    expect(formatDateFromDate(new Date(2026, 9, 20, 10, 0, 0))).toBe('20/10/2026');
  });

  it('accepts a numeric timestamp', () => {
    expect(formatDateFromDate(new Date(2026, 0, 2, 8, 0, 0).getTime())).toBe('02/01/2026');
  });

  // Regression B-1: slicing `toISOString()` reads the UTC date, one day (and one year) ahead at 21h on 31/12.
  it('does not shift the date at the time-zone edge (21h on 31/12 in UTC-3)', () => {
    const local = new Date(2026, 11, 31, 21, 0, 0);
    expect(local.toISOString().slice(0, 10)).toBe('2027-01-01');
    expect(formatDateFromDate(local)).toBe('31/12/2026');
  });

  it('does not shift the date at the lower edge (00h30 on the 1st)', () => {
    expect(formatDateFromDate(new Date(2026, 2, 1, 0, 30, 0))).toBe('01/03/2026');
  });

  it('returns a dash for an invalid Date', () => {
    expect(formatDateFromDate(new Date('não é data'))).toBe('—');
  });
});

describe('formatDateTime', () => {
  it('formats date and time in Brasília time', () => {
    expect(formatDateTime(new Date(2026, 4, 9, 14, 5, 0).toISOString())).toBe('09/05/2026 às 14:05');
  });

  it('returns a dash for empty input and the raw input when invalid', () => {
    expect(formatDateTime('')).toBe('—');
    expect(formatDateTime('abacaxi')).toBe('abacaxi');
  });
});

describe('formatDocument', () => {
  it('masks 11 digits as CPF', () => {
    expect(formatDocument('12345678901')).toBe('123.456.789-01');
  });

  it('masks 14 digits as CNPJ', () => {
    expect(formatDocument('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('strips punctuation before masking (idempotent)', () => {
    expect(formatDocument('123.456.789-01')).toBe('123.456.789-01');
  });

  it('returns the raw input for unexpected lengths', () => {
    expect(formatDocument('123')).toBe('123');
    expect(formatDocument('')).toBe('');
  });
});

describe('onlyDigits', () => {
  it('removes everything that is not a digit', () => {
    expect(onlyDigits('+55 (61) 99999-0000')).toBe('5561999990000');
    expect(onlyDigits('abc')).toBe('');
  });
});
