import type { Id } from './common';

/** pending → enrolled → in_progress → completed (enables the certificate). */
export type EnrollmentStatus = 'pending' | 'enrolled' | 'in_progress' | 'completed';

/**
 * A person's place in a course/cohort: the admin's "student of the cohort" and the customer's "person on
 * the seat" (A2: the customer area still uses its own model). Names are denormalized for the mock.
 */
export interface Enrollment {
  id: Id;
  personId: Id;
  personName: string;
  personCpf: string;
  personEmail: string;
  /** Customer that bought the seat. Linked by name: Enrollment has no customerId yet. */
  customerName: string;
  concessionaireId: Id | null;
  concessionaireName: string;
  courseId: Id;
  courseTitle: string;
  /** null = seat bought without a cohort. */
  cohortId: Id | null;
  status: EnrollmentStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
