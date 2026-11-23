import { slugify, uniqueSlug } from './slugify';

describe('slugify', () => {
  it('lower-cases, strips accents and joins words with dashes', () => {
    expect(slugify('Conscientização com AVSEC (Aviation Security)')).toBe(
      'conscientizacao-com-avsec-aviation-security',
    );
  });

  it('trims leading and trailing separators', () => {
    expect(slugify('  —Direção Defensiva!  ')).toBe('direcao-defensiva');
    expect(slugify('')).toBe('');
  });
});

describe('uniqueSlug (#61)', () => {
  it('keeps a free slug and numbers a taken one', () => {
    expect(uniqueSlug('curso', [])).toBe('curso');
    expect(uniqueSlug('curso', ['curso'])).toBe('curso-2');
    expect(uniqueSlug('curso', ['curso', 'curso-2', 'curso-3'])).toBe('curso-4');
  });
});
