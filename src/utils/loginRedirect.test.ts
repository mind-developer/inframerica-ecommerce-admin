import { loginRedirect } from './loginRedirect';

describe('loginRedirect', () => {
  it('keeps where the visitor was heading, query included', () => {
    const url = loginRedirect(new URL('http://localhost/clientes?id=7'));
    expect(url.pathname).toBe('/login');
    expect(url.searchParams.get('redirect')).toBe('/clientes?id=7');
  });

  it('adds no destination for the dashboard', () => {
    expect(loginRedirect(new URL('http://localhost/')).href).toBe('http://localhost/login');
  });
});
