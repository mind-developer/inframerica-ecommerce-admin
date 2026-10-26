import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { getOrderSettings, getStoreSettings } from '@/services/content.service';

export async function getCachedStoreSettings() {
  'use cache';
  cacheTag(CACHE_TAGS.storeSettings);
  cacheLife('days');
  return getStoreSettings();
}

export async function getCachedOrderSettings() {
  'use cache';
  cacheTag(CACHE_TAGS.orderSettings);
  cacheLife('days');
  return getOrderSettings();
}
