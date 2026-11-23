'use server';

import { adminMutation } from '@/features/auth/server';
import { outsideSector, sectorOutside } from '../data/sectorGuard';
import { coursesService } from '@/services/courses.service';
import type { CourseInput } from '@/types/catalog';
import type { ActionResult } from '@/types/common';
import { slugify, uniqueSlug } from '@/utils/slugify';
import { courseSchema, type CourseFormValues } from '../schemas/courseSchema';
import { cleanCurriculum, cleanList } from '../utils/courseContent';

const OTHER_SECTOR = { ok: false as const, error: 'Este curso é de outro setor.' };

/**
 * Saves a course for the store. The slug falls back to the title; the module count follows the curriculum
 * when there is one, so the public page never contradicts itself. The storefront is told to refresh.
 */
export async function saveCourse(id: string | null, values: CourseFormValues): Promise<ActionResult<{ id: string }>> {
  const parsed = courseSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  const data = parsed.data;
  if ((await sectorOutside(data.sectorId)) || (await outsideSector([id]))) return OTHER_SECTOR;
  // A typed slug is the admin's choice: taken means an error. One made from the title is numbered (#61).
  const base = slugify(data.slug || data.title);
  if (!base) return { ok: false, error: 'O endereço (slug) precisa de letras ou números' };
  const taken = (await coursesService.list()).filter((c) => c.id !== id).map((c) => c.slug);
  if (data.slug && taken.includes(base)) return { ok: false, error: 'Já existe um curso com este endereço (slug)' };
  const slug = data.slug ? base : uniqueSlug(base, taken);
  const content = cleanCurriculum(data.curriculum);
  if ('error' in content) return { ok: false, error: content.error };
  const { curriculum } = content;
  const input: CourseInput = {
    ...data,
    slug,
    learningPoints: cleanList(data.learningPoints),
    targetAudience: cleanList(data.targetAudience),
    prerequisites: cleanList(data.prerequisites),
    curriculum,
    modules: curriculum.length > 0 ? curriculum.length : data.modules,
    // An online course has no place: the field is hidden, so an old value must not stay behind (#56).
    defaultLocation: (data.modality !== 'online' && data.defaultLocation) || undefined,
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
  if (await outsideSector([id])) return OTHER_SECTOR;
  return adminMutation('courses', ['courses'], () => coursesService.remove(id), ['courses']);
}
