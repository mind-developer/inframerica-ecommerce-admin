import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { getSiteContent } from '@/services/content.service';

export async function getCachedSiteContent() {
  'use cache';
  cacheTag(CACHE_TAGS.siteContent);
  cacheLife('days');
  return getSiteContent();
}
