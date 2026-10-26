/**
 * Tells the storefront that public content changed, so it revalidates its cached pages
 * (`POST {STOREFRONT_URL}/api/revalidate`). Best effort: the admin edit already succeeded, and the
 * storefront's own cache lifetimes catch up if the call fails. Skipped when not configured.
 */
import 'server-only';

export type StorefrontTag = 'courses' | 'credentials' | 'site-content' | 'store-settings' | 'coupons';

export async function notifyStorefront(tags: StorefrontTag[]): Promise<boolean> {
  const base = process.env.STOREFRONT_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret || tags.length === 0) return false;
  try {
    const res = await fetch(new URL('/api/revalidate', base), {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
