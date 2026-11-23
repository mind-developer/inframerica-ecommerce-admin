import 'server-only';
import { coursesInSector, sectorOf } from '@/domain/sectorScope';
import { coursesService } from '@/services/courses.service';
import type { AdminSessionUser } from '@/types/auth';

/** Every course, published or not (the admin also sees drafts). Read per request: it needs the admin's API token. */
export const getCourses = () => coursesService.list();

/** The courses this admin may see: only their sector's, unless they see every sector (#49). */
export async function getSectorCourses(admin: AdminSessionUser) {
  return coursesInSector(await getCourses(), sectorOf(admin));
}
