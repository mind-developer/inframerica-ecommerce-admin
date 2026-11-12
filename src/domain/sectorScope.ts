import type { Course } from '@/types/catalog';
import type { Cohort } from '@/types/cohorts';
import type { Order } from '@/types/orders';

/**
 * The sector an admin's panel is limited to (#49), or null for "every sector":
 * the owner and admins without a sector see everything.
 */
export const sectorOf = (admin: { owner: boolean; sectorId: string | null }) => (admin.owner ? null : admin.sectorId);

export const coursesInSector = (courses: Course[], sector: string | null) =>
  sector ? courses.filter((c) => c.sectorId === sector) : courses;

/** An order belongs to every sector of its courses. Orders without courses (refunds, credentialing) stay out. */
export function ordersInSector(orders: Order[], courses: Course[], sector: string | null) {
  if (!sector) return orders;
  const ids = new Set(coursesInSector(courses, sector).map((c) => c.id));
  return orders.filter((o) => o.items.some((i) => ids.has(i.courseId)));
}

/** A cohort follows its course's sector. */
export function cohortsInSector(cohorts: Cohort[], courses: Course[], sector: string | null) {
  if (!sector) return cohorts;
  const ids = new Set(coursesInSector(courses, sector).map((c) => c.id));
  return cohorts.filter((c) => ids.has(c.courseId));
}
