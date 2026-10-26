import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { credentialsService } from '@/services/catalog.service';

export async function getCredentials() {
  'use cache';
  cacheTag(CACHE_TAGS.credentials);
  cacheLife('days');
  return credentialsService.list();
}
