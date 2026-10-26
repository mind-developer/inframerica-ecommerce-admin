import type { Cohort } from '@/types/cohorts';

/** Where a canceled cohort's people can go: another open cohort of the same course with a free seat. */
export const findSubstituteCohort = (canceled: Cohort, cohorts: Cohort[]): Cohort | null =>
  cohorts.find(
    (c) =>
      c.id !== canceled.id && c.courseId === canceled.courseId && c.status === 'open' && c.takenSeats < c.totalSeats,
  ) ?? null;
