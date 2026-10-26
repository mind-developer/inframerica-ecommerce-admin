import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { ordersService } from '@/services/commerce.service';

/** Orders arrive from the store all the time: short cache, expired on every admin change. */
export async function getOrders() {
  'use cache';
  cacheTag(CACHE_TAGS.orders);
  cacheLife('minutes');
  return ordersService.list();
}
