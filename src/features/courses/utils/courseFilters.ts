import type { Course } from '@/types/catalog';

export type CourseStatus = 'published' | 'draft';
export const COURSE_STATUSES = ['published', 'draft'] as const;

/** The list's search (title, category, instructor) and its published/unpublished filter (#66). */
export function filterCourses(courses: Course[], q: string, status: CourseStatus | null): Course[] {
  const term = q.trim().toLowerCase();
  return courses.filter(
    (c) =>
      (!status || c.active === (status === 'published')) &&
      (!term || [c.title, c.category, c.instructor].some((t) => t.toLowerCase().includes(term))),
  );
}
