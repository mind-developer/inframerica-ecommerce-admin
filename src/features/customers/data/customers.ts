import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { customersService } from '@/services/commerce.service';

/** The mock customers behind orders, coupons and the dashboard; the Clientes screen reads the API. */
export async function getCustomers() {
  'use cache';
  cacheTag(CACHE_TAGS.customers);
  cacheLife('minutes');
  return customersService.list();
}
