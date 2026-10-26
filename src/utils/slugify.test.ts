import { slugify } from './slugify';

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
