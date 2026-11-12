'use server';

import { findSubstituteCohort } from '@/domain/cohorts';
import { adminMutation } from '@/features/auth/server';
import { outsideSector } from '@/features/courses/server';
import { cohortsService } from '@/services/commerce.service';
import {
  listEnrollments,
  listEnrollmentsByCohort,
  setEnrollmentCohort,
  updateEnrollmentStatus,
} from '@/services/enrollments.service';
import type { ActionResult } from '@/types/common';
import type { EnrollmentStatus } from '@/types/enrollments';
import { cohortSchema, type CohortFormValues } from '../schemas/cohortSchema';

const OTHER_SECTOR = { ok: false as const, error: 'Esta turma é de outro setor.' };

const courseOf = async (cohortId: string | null | undefined) =>
  cohortId ? (await cohortsService.list()).find((c) => c.id === cohortId)?.courseId : undefined;

/** A sector-limited admin (#49) only touches cohorts of their sector's courses. */
const cohortOutside = async (cohortId: string | null) => outsideSector([await courseOf(cohortId)]);

const enrollmentOutside = async (enrollmentId: string) => {
  const enrollment = (await listEnrollments()).find((e) => e.id === enrollmentId);
  return outsideSector([await courseOf(enrollment?.cohortId)]);
};

export async function saveCohort(id: string | null, values: CohortFormValues): Promise<ActionResult<unknown>> {
  const parsed = cohortSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  if (await outsideSector([parsed.data.courseId, await courseOf(id)])) return OTHER_SECTOR;
  return adminMutation('cohorts', ['cohorts'], () =>
    id ? cohortsService.update(id, parsed.data) : cohortsService.create(parsed.data),
  );
}

export async function deleteCohort(id: string): Promise<ActionResult<unknown>> {
  if (await cohortOutside(id)) return OTHER_SECTOR;
  return adminMutation('cohorts', ['cohorts'], () => cohortsService.remove(id));
}

export interface CancelOutcome {
  movedTo: string | null;
  people: number;
}

/**
 * Cancels a cohort. With a substitute (same course, open, free seat) everyone moves there keeping their
 * credit; without one, each enrollment goes back to a credit with no cohort. The cohort is kept, marked canceled.
 */
export async function cancelCohort(id: string): Promise<ActionResult<CancelOutcome>> {
  if (await cohortOutside(id)) return OTHER_SECTOR;
  return adminMutation('cohorts', ['cohorts', 'enrollments'], async () => {
    const cohorts = await cohortsService.list();
    const cohort = cohorts.find((c) => c.id === id);
    if (!cohort) throw new Error('Turma não encontrada');
    const substitute = findSubstituteCohort(cohort, cohorts);
    const people = await listEnrollmentsByCohort(id);
    for (const e of people) await setEnrollmentCohort(e.id, substitute?.id ?? null);
    await cohortsService.update(id, { status: 'canceled' });
    return { movedTo: substitute?.id ?? null, people: people.length };
  });
}

export async function changeEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<ActionResult<unknown>> {
  if (await enrollmentOutside(id)) return OTHER_SECTOR;
  return adminMutation('cohorts', ['enrollments'], () => updateEnrollmentStatus(id, status));
}

export async function unlinkEnrollment(id: string): Promise<ActionResult<unknown>> {
  if (await enrollmentOutside(id)) return OTHER_SECTOR;
  return adminMutation('cohorts', ['enrollments'], () => setEnrollmentCohort(id, null));
}
