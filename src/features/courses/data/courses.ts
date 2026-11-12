import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { coursesInSector, sectorOf } from '@/domain/sectorScope';
import { coursesService } from '@/services/catalog.service';
import type { AdminSessionUser } from '@/types/auth';

/** Every course, published or not (the admin also sees drafts). */
export async function getCourses() {
  'use cache';
  cacheTag(CACHE_TAGS.courses);
  cacheLife('hours');
  return coursesService.list();
}

/** The courses this admin may see: only their sector's, unless they see every sector (#49). */
export async function getSectorCourses(admin: AdminSessionUser) {
  return coursesInSector(await getCourses(), sectorOf(admin));
}
