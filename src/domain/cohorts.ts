import type { Cohort, CohortStatus } from '@/types/cohorts';

/** No seat left for anyone else. */
export const isFull = (c: Pick<Cohort, 'takenSeats' | 'totalSeats'>) => c.takenSeats >= c.totalSeats;

/**
 * The status to show (#64): an open cohort with no seat left is closed, and opens again when a seat is freed.
 * Derived like the seats themselves, so what the team set by hand is never overwritten.
 */
export const cohortStatus = (c: Pick<Cohort, 'status' | 'takenSeats' | 'totalSeats'>): CohortStatus =>
  c.status === 'open' && isFull(c) ? 'closed' : c.status;

/** Where a canceled cohort's people can go: another open cohort of the same course with seats for all of them. */
export const findSubstituteCohort = (canceled: Cohort, cohorts: Cohort[]): Cohort | null =>
  cohorts.find(
    (c) =>
      c.id !== canceled.id &&
      c.courseId === canceled.courseId &&
      cohortStatus(c) === 'open' &&
      c.totalSeats - c.takenSeats >= canceled.takenSeats,
  ) ?? null;

/**
 * Seats taken = enrollments linked to the cohort (#63): derived, never typed in. Unlinking an enrollment
 * frees its seat. Enrollments still live in the mock, so the admin computes it on read.
 */
export const withOccupancy = <C extends Cohort>(cohorts: C[], enrollments: { cohortId: string | null }[]): C[] =>
  cohorts.map((c) => ({ ...c, takenSeats: enrollments.filter((e) => e.cohortId === c.id).length }));
