/**
 * In-memory stand-in for `services/courses.service` (the API), over the mock db's seed courses.
 * `test/setup.ts` installs it for every test; `courses.service.test.ts` tests the real one.
 */
import { createCrudService } from '@/services/mock/crud';
import { getDb } from '@/services/mock/db';
import { nowIso } from '@/services/mock/table';
import type { Course, CourseInput } from '@/types/catalog';
import type { Id } from '@/types/common';

const crud = createCrudService<Course, CourseInput>(
  () => getDb().courses,
  (input) => ({ ...input, updatedAt: nowIso() }),
  'cur',
);

export const coursesService = {
  list: crud.list,
  get: crud.get,
  create: crud.create,
  update: (id: Id, input: CourseInput) => crud.update(id, { ...input, updatedAt: nowIso() } as Partial<CourseInput>),
  setPublished: (id: Id, active: boolean) => crud.update(id, { active, updatedAt: nowIso() } as Partial<CourseInput>),
  remove: async (id: Id) => {
    await crud.remove(id);
  },
};
