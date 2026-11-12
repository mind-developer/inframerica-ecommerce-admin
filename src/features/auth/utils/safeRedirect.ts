/** Only same-site paths are honored after sign-in; anything else falls back. Blocks `//evil.com` and URLs. */
export function safeRedirect(target: string | null | undefined, fallback = '/'): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) return fallback;
  if (target.startsWith('/login')) return fallback;
  return target;
}
