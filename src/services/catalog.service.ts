import 'server-only';
import type { Course, CourseInput, Credential, CredentialInput } from '@/types/catalog';
import type { Id } from '@/types/common';
import { createCrudService } from './mock/crud';
import { getDb } from './mock/db';
import { latency, nowIso } from './mock/table';

const courseCrud = createCrudService<Course, CourseInput>(
  () => getDb().courses,
  (input) => ({ ...input, updatedAt: nowIso() }),
  'cur',
);

/** Courses. The update stamp belongs to the server: callers can't forge `updatedAt`. */
export const coursesService = {
  ...courseCrud,
  async update(id: Id, patch: Partial<CourseInput>): Promise<Course> {
    const { updatedAt: _ignored, ...rest } = patch as Partial<Course>;
    return courseCrud.update(id, { ...rest, updatedAt: nowIso() } as Partial<CourseInput>);
  },
  async getBySlug(slug: string): Promise<Course | null> {
    await latency();
    return getDb().courses.findBy((c) => c.slug === slug);
  },
};

export const credentialsService = createCrudService<Credential, CredentialInput>(
  () => getDb().credentials,
  (input) => ({ ...input, createdAt: nowIso() }),
  'cred',
);
