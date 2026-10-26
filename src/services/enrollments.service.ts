import 'server-only';
import type { Id } from '@/types/common';
import type { Enrollment, EnrollmentStatus } from '@/types/enrollments';
import { getDb } from './mock/db';
import { latency, newId, nowIso } from './mock/table';

export type EnrollmentInput = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;

const table = () => getDb().enrollments;

const mustFind = (id: Id) => {
  const row = table().find(id);
  if (!row) throw new Error(`Matrícula ${id} não encontrada`);
  return row;
};

export async function listEnrollments(): Promise<Enrollment[]> {
  await latency();
  return table().all();
}

/** Students of a cohort, by name. */
export async function listEnrollmentsByCohort(cohortId: Id): Promise<Enrollment[]> {
  await latency();
  return table()
    .all()
    .filter((e) => e.cohortId === cohortId)
    .sort((a, b) => a.personName.localeCompare(b.personName, 'pt-BR'));
}

export async function createEnrollment(input: EnrollmentInput): Promise<Enrollment> {
  await latency();
  const now = nowIso();
  return table().insert({ ...input, id: newId('mat'), completedAt: null, createdAt: now, updatedAt: now });
}

/** Moves the enrollment through its life cycle. Completion is stamped here (it enables the certificate). */
export async function updateEnrollmentStatus(id: Id, status: EnrollmentStatus): Promise<Enrollment> {
  await latency();
  const current = mustFind(id);
  return table().update(id, {
    status,
    completedAt: status === 'completed' ? (current.completedAt ?? nowIso()) : null,
    updatedAt: nowIso(),
  });
}

/** Links (or, with null, unlinks) the person to a cohort. Linking promotes pending → enrolled. */
export async function setEnrollmentCohort(id: Id, cohortId: Id | null): Promise<Enrollment> {
  await latency();
  const current = mustFind(id);
  const status: EnrollmentStatus =
    cohortId === null ? 'pending' : current.status === 'pending' ? 'enrolled' : current.status;
  return table().update(id, { cohortId, status, updatedAt: nowIso() });
}
