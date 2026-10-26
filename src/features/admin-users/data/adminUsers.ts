import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { adminUsersService } from '@/services/commerce.service';

export async function getAdminUsers() {
  'use cache';
  cacheTag(CACHE_TAGS.adminUsers);
  cacheLife('days');
  return adminUsersService.list();
}
