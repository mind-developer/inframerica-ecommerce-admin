import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { paymentLinksService } from '@/services/commerce.service';

export async function getPaymentLinks() {
  'use cache';
  cacheTag(CACHE_TAGS.paymentLinks);
  cacheLife('minutes');
  return paymentLinksService.list();
}
