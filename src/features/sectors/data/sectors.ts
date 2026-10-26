import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { sectorsService } from '@/services/catalog.service';

export async function getSectors() {
  'use cache';
  cacheTag(CACHE_TAGS.sectors);
  cacheLife('days');
  return sectorsService.list();
}
