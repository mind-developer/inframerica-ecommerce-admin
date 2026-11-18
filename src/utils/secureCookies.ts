/**
 * Whether session cookies carry the `Secure` flag (sent over HTTPS only). On by default in production;
 * `COOKIE_SECURE=false` turns it off for an environment served over plain HTTP (homologation before TLS).
 */
export function secureCookies(env: Record<string, string | undefined> = process.env): boolean {
  const flag = env.COOKIE_SECURE?.trim().toLowerCase();
  if (flag === 'false') return false;
  if (flag === 'true') return true;
  return env.NODE_ENV === 'production';
}
