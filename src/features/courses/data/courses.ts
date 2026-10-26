import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { coursesService } from '@/services/catalog.service';

/** Every course, published or not (the admin also sees drafts). */
export async function getCourses() {
  'use cache';
  cacheTag(CACHE_TAGS.courses);
  cacheLife('hours');
  return coursesService.list();
}
