import { safeRedirect } from './safeRedirect';

describe('safeRedirect', () => {
  it('keeps a path of this site, query included', () => {
    expect(safeRedirect('/clientes?id=1')).toBe('/clientes?id=1');
  });

  it('falls back to the dashboard for other sites, empty values and the sign-in page', () => {
    for (const bad of [null, '', 'https://evil.com', '//evil.com', '/\\evil.com', '/login']) {
      expect(safeRedirect(bad)).toBe('/');
    }
  });
});
