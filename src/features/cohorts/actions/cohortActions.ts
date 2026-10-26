'use server';

import { findSubstituteCohort } from '@/domain/cohorts';
import { adminMutation } from '@/features/auth/server';
import { cohortsService } from '@/services/commerce.service';
import { listEnrollmentsByCohort, setEnrollmentCohort, updateEnrollmentStatus } from '@/services/enrollments.service';
import type { ActionResult } from '@/types/common';
import type { EnrollmentStatus } from '@/types/enrollments';
import { cohortSchema, type CohortFormValues } from '../schemas/cohortSchema';

export async function saveCohort(id: string | null, values: CohortFormValues): Promise<ActionResult<unknown>> {
  const parsed = cohortSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  return adminMutation(['cohorts'], () =>
    id ? cohortsService.update(id, parsed.data) : cohortsService.create(parsed.data),
  );
}

export async function deleteCohort(id: string): Promise<ActionResult<unknown>> {
  return adminMutation(['cohorts'], () => cohortsService.remove(id));
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
  return adminMutation(['cohorts', 'enrollments'], async () => {
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
  return adminMutation(['enrollments'], () => updateEnrollmentStatus(id, status));
}

export async function unlinkEnrollment(id: string): Promise<ActionResult<unknown>> {
  return adminMutation(['enrollments'], () => setEnrollmentCohort(id, null));
}
