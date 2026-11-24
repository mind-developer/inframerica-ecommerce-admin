/**
 * In-memory stand-in for `services/cohorts.service` (the API), over the mock db's seed cohorts.
 * `test/setup.ts` installs it for every test; `cohorts.service.test.ts` tests the real one.
 */
import { createCrudService } from '@/services/mock/crud';
import { getDb } from '@/services/mock/db';
import type { Cohort, CohortInput } from '@/types/cohorts';
import type { Id } from '@/types/common';

const crud = createCrudService<Cohort, CohortInput>(
  () => getDb().cohorts,
  (input) => ({ ...input, takenSeats: 0 }),
  'tur',
);

export const cohortsService = {
  list: crud.list,
  get: crud.get,
  create: crud.create,
  update: (id: Id, patch: Partial<CohortInput>) => crud.update(id, patch),
  remove: async (id: Id) => {
    await crud.remove(id);
  },
};
