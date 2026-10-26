import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { customersService } from '@/services/commerce.service';

/** Customers are created by sign-ups and purchases on the store, so the cache is short. */
export async function getCustomers() {
  'use cache';
  cacheTag(CACHE_TAGS.customers);
  cacheLife('minutes');
  return customersService.list();
}
