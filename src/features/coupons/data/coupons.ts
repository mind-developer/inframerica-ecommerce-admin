import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { couponsService } from '@/services/commerce.service';

/** Uses change at every checkout on the store: short cache. */
export async function getCoupons() {
  'use cache';
  cacheTag(CACHE_TAGS.coupons);
  cacheLife('minutes');
  return couponsService.list();
}
