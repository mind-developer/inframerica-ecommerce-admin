/** The sign-in page URL for a visitor without session; the page they asked for travels as `?redirect=`. */
export function loginRedirect(requested: URL): URL {
  const login = new URL('/login', requested);
  if (requested.pathname !== '/') login.searchParams.set('redirect', requested.pathname + requested.search);
  return login;
}
