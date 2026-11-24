import type { Cohort } from '@/types/cohorts';

/** Where a canceled cohort's people can go: another open cohort of the same course with a free seat. */
export const findSubstituteCohort = (canceled: Cohort, cohorts: Cohort[]): Cohort | null =>
  cohorts.find(
    (c) =>
      c.id !== canceled.id && c.courseId === canceled.courseId && c.status === 'open' && c.takenSeats < c.totalSeats,
  ) ?? null;

/**
 * Seats taken = enrollments linked to the cohort (#63): derived, never typed in. Unlinking an enrollment
 * frees its seat. Enrollments still live in the mock, so the admin computes it on read.
 */
export const withOccupancy = <C extends Cohort>(cohorts: C[], enrollments: { cohortId: string | null }[]): C[] =>
  cohorts.map((c) => ({ ...c, takenSeats: enrollments.filter((e) => e.cohortId === c.id).length }));
