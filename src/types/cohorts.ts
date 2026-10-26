import type { Id } from './common';

export type CohortStatus = 'open' | 'closed' | 'completed' | 'canceled';

/** A scheduled class ("turma") of a course. */
export interface Cohort {
  id: Id;
  courseId: Id;
  startDate: string;
  endDate: string;
  schedule: string;
  location: string;
  totalSeats: number;
  takenSeats: number;
  status: CohortStatus;
  /** Where participants meet (may differ from the course address). */
  meetingPoint?: string;
  /** What participants must bring. */
  materials?: string;
  /** E-mail template sent to participants, with placeholders such as {{nome}}. */
  emailTemplate?: string;
}

export type CohortInput = Omit<Cohort, 'id'>;
