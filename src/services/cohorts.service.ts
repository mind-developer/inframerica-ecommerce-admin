/** Cohorts, from inframerica-ecommerce-api (#62). Mock enrollments point to them by id. */
import 'server-only';
import type { Cohort, CohortInput } from '@/types/cohorts';
import type { Id } from '@/types/common';
import { adminFind, adminRead, adminWrite } from './api/adminApi';

const notFound = 'Turma não encontrada';
const conflicts = { 'unknown-course': 'O curso escolhido não existe mais' };

/** The API takes every text, empty or not. */
const body = ({ meetingPoint, materials, emailTemplate, ...rest }: CohortInput) => ({
  ...rest,
  meetingPoint: meetingPoint ?? '',
  materials: materials ?? '',
  emailTemplate: emailTemplate ?? '',
});

/** Optional texts come back as ''; the admin's `Cohort` leaves them out. A write always answers the row. */
const fromApi = (c: Cohort | null): Cohort => {
  if (!c) throw new Error('Resposta vazia da API');
  return {
    ...c,
    meetingPoint: c.meetingPoint || undefined,
    materials: c.materials || undefined,
    emailTemplate: c.emailTemplate || undefined,
  };
};

const get = async (id: Id) => {
  const c = await adminFind<Cohort>(`/admin/cohorts/${encodeURIComponent(id)}`);
  return c && fromApi(c);
};

export const cohortsService = {
  /** Every cohort, soonest first. */
  list: async () => (await adminRead<Cohort[]>('/admin/cohorts')).map(fromApi),

  get,

  create: async (input: CohortInput) =>
    fromApi(await adminWrite<Cohort>('/admin/cohorts', 'POST', { body: body(input), conflicts, notFound })),

  /** The API takes the whole cohort: a partial change (e.g. cancelling) is merged into the current one. */
  update: async (id: Id, patch: Partial<CohortInput>) => {
    const current = await get(id);
    if (!current) throw new Error(notFound);
    const { id: _id, ...input } = { ...current, ...patch };
    return fromApi(
      await adminWrite<Cohort>(`/admin/cohorts/${id}`, 'PATCH', { body: body(input), conflicts, notFound }),
    );
  },

  remove: async (id: Id) => {
    await adminWrite(`/admin/cohorts/${id}`, 'DELETE', { notFound });
  },
};
