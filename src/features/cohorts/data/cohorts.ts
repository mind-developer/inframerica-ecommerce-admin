import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { cohortsService, listConcessionaires } from '@/services/commerce.service';
import { listEnrollments } from '@/services/enrollments.service';

export async function getCohorts() {
  'use cache';
  cacheTag(CACHE_TAGS.cohorts);
  cacheLife('hours');
  return cohortsService.list();
}

/** Enrollments change from the store (links) and the admin: short cache. */
export async function getEnrollments() {
  'use cache';
  cacheTag(CACHE_TAGS.enrollments);
  cacheLife('minutes');
  return listEnrollments();
}

export async function getConcessionaires() {
  'use cache';
  cacheTag(CACHE_TAGS.concessionaires);
  cacheLife('days');
  return listConcessionaires();
}
