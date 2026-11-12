import 'server-only';
import { sectorOf } from '@/domain/sectorScope';
import { requireAdmin } from '@/features/auth/server';
import { coursesService } from '@/services/catalog.service';

/**
 * True when the admin is limited to a sector (#49) and any of these courses is outside it.
 * Unknown or missing ids are left to the action's own checks.
 */
export async function outsideSector(courseIds: (string | null | undefined)[]): Promise<boolean> {
  const sector = sectorOf(await requireAdmin());
  if (!sector) return false;
  const courses = await coursesService.list();
  return courseIds.some((id) => {
    const course = id ? courses.find((c) => c.id === id) : undefined;
    return Boolean(course && course.sectorId !== sector);
  });
}

/** Same check for a course's own new sector, when one is being saved. */
export async function sectorOutside(sectorId: string): Promise<boolean> {
  const sector = sectorOf(await requireAdmin());
  return Boolean(sector && sectorId !== sector);
}
