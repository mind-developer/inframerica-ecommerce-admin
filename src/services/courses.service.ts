/** Courses, from inframerica-ecommerce-api (#55). Mock cohorts and orders point to them by id. */
import 'server-only';
import type { Course, CourseInput } from '@/types/catalog';
import type { Id } from '@/types/common';
import { adminFind, adminRead, adminWrite } from './api/adminApi';

const notFound = 'Curso não encontrado';
const conflicts = {
  'slug-taken': 'Já existe um curso com este endereço (slug)',
  'unknown-sector': 'O setor escolhido não existe mais',
  'course-in-use': 'Este curso tem turmas. Remova ou mova as turmas antes.',
};

/** The API takes every text, empty or not. */
const body = (input: CourseInput) => ({
  ...input,
  defaultLocation: input.defaultLocation ?? '',
  sapCode: input.sapCode ?? '',
});

/** Optional texts come back as ''; the admin's `Course` leaves them out. A write always answers the row. */
const fromApi = (c: Course | null): Course => {
  if (!c) throw new Error('Resposta vazia da API');
  return {
    ...c,
    defaultLocation: c.defaultLocation || undefined,
    sapCode: c.sapCode || undefined,
  };
};

export const coursesService = {
  /** Every course, drafts too. */
  list: async () => (await adminRead<Course[]>('/admin/courses')).map(fromApi),

  get: async (id: Id) => {
    const c = await adminFind<Course>(`/admin/courses/${encodeURIComponent(id)}`);
    return c && fromApi(c);
  },

  create: async (input: CourseInput) =>
    fromApi(await adminWrite<Course>('/admin/courses', 'POST', { body: body(input), conflicts, notFound })),

  update: async (id: Id, input: CourseInput) =>
    fromApi(await adminWrite<Course>(`/admin/courses/${id}`, 'PATCH', { body: body(input), conflicts, notFound })),

  /** Publish or unpublish without sending the whole course (#66). */
  setPublished: async (id: Id, active: boolean) =>
    fromApi(await adminWrite<Course>(`/admin/courses/${id}/published`, 'PATCH', { body: { active }, notFound })),

  remove: async (id: Id) => {
    await adminWrite(`/admin/courses/${id}`, 'DELETE', { notFound });
  },
};
