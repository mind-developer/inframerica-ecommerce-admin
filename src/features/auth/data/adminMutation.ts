import 'server-only';
import { updateTag } from 'next/cache';
import type { Resource } from '@/constants/access';
import type { CACHE_TAGS } from '@/constants/cacheTags';
import { notifyStorefront, type StorefrontTag } from '@/services/storefront.service';
import type { ActionResult } from '@/types/common';
import { can, requireAdmin } from './currentAdmin';

type Tag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/**
 * The shape of every admin write: check the session and the tab's `manage` permission, run the service call, expire the admin's cached
 * reads (`updateTag`: the admin sees the change at once) and, for public data, tell the storefront.
 */
export async function adminMutation<T>(
  resource: Resource,
  tags: Tag[],
  run: () => Promise<T>,
  storefront: StorefrontTag[] = [],
): Promise<ActionResult<T>> {
  const admin = await requireAdmin();
  if (!can(admin, resource, 'manage')) return { ok: false, error: 'Você não tem permissão para esta ação.' };
  try {
    const data = await run();
    tags.forEach((tag) => updateTag(tag));
    if (storefront.length > 0) await notifyStorefront(storefront);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Erro inesperado' };
  }
}
