import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_TAGS } from '@/constants/cacheTags';
import { ordersInSector, sectorOf } from '@/domain/sectorScope';
import { getCourses } from '@/features/courses/server';
import { ordersService } from '@/services/commerce.service';
import type { AdminSessionUser } from '@/types/auth';

/** Orders arrive from the store all the time: short cache, expired on every admin change. */
export async function getOrders() {
  'use cache';
  cacheTag(CACHE_TAGS.orders);
  cacheLife('minutes');
  return ordersService.list();
}

/** The orders this admin may see: those with a course of their sector, unless they see every sector (#49). */
export async function getSectorOrders(admin: AdminSessionUser) {
  const [orders, courses] = await Promise.all([getOrders(), getCourses()]);
  return ordersInSector(orders, courses, sectorOf(admin));
}
