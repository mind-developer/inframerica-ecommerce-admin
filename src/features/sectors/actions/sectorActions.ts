'use server';

import { refresh } from 'next/cache';
import { adminMutation } from '@/features/auth/server';
import { coursesService, credentialsService } from '@/services/catalog.service';
import { createSector, removeSector, updateSector } from '@/services/sectors.service';
import type { ActionResult } from '@/types/common';
import { sectorSchema, type SectorFormValues } from '../schemas/sectorSchema';

const refreshed = <T>(result: ActionResult<T>) => {
  if (result.ok) refresh();
  return result;
};

export async function saveSector(id: string | null, values: SectorFormValues): Promise<ActionResult<unknown>> {
  const parsed = sectorSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  return refreshed(await adminMutation([], () => (id ? updateSector(id, parsed.data) : createSector(parsed.data))));
}

/** Courses and credentials still live in the mock, so the link is checked here and not by the API. */
export async function deleteSector(id: string): Promise<ActionResult<unknown>> {
  const [courses, credentials] = await Promise.all([coursesService.list(), credentialsService.list()]);
  if (courses.some((c) => c.sectorId === id) || credentials.some((c) => c.sectorIds.includes(id)))
    return { ok: false, error: 'Este setor tem cursos ou credenciais vinculados.' };
  return refreshed(await adminMutation([], () => removeSector(id)));
}
