'use server';

import { sectorOf } from '@/domain/sectorScope';
import { adminMutation, requireAdmin } from '@/features/auth/server';
import { coursesService } from '@/services/catalog.service';
import type { CourseInput } from '@/types/catalog';
import type { ActionResult } from '@/types/common';
import { slugify } from '@/utils/slugify';
import { courseSchema, type CourseFormValues } from '../schemas/courseSchema';

const OTHER_SECTOR = { ok: false as const, error: 'Este curso é de outro setor.' };

/** An admin limited to a sector (#49) only touches its courses: the current one and, on save, the new one. */
async function outsideSector(courseId: string | null, newSectorId?: string) {
  const sector = sectorOf(await requireAdmin());
  if (!sector) return false;
  if (newSectorId !== undefined && newSectorId !== sector) return true;
  if (!courseId) return false;
  const current = (await coursesService.list()).find((c) => c.id === courseId);
  return Boolean(current && current.sectorId !== sector);
}

/**
 * Saves a course for the store. The slug falls back to the title; the module count follows the curriculum
 * when there is one, so the public page never contradicts itself. The storefront is told to refresh.
 */
export async function saveCourse(id: string | null, values: CourseFormValues): Promise<ActionResult<{ id: string }>> {
  const parsed = courseSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  const data = parsed.data;
  if (await outsideSector(id, data.sectorId)) return OTHER_SECTOR;
  const slug = slugify(data.slug || data.title);
  if ((await coursesService.list()).some((c) => c.slug === slug && c.id !== id))
    return { ok: false, error: 'Já existe um curso com este endereço (slug)' };
  const input: CourseInput = {
    ...data,
    slug,
    modules: data.curriculum.length > 0 ? data.curriculum.length : data.modules,
    defaultLocation: data.defaultLocation || undefined,
    sapCode: data.sapCode || undefined,
  };
  return adminMutation(
    'courses',
    ['courses'],
    async () => ({ id: (id ? await coursesService.update(id, input) : await coursesService.create(input)).id }),
    ['courses'],
  );
}

export async function deleteCourse(id: string): Promise<ActionResult<unknown>> {
  if (await outsideSector(id)) return OTHER_SECTOR;
  return adminMutation('courses', ['courses'], () => coursesService.remove(id), ['courses']);
}
