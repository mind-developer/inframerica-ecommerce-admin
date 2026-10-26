'use server';

import { adminMutation } from '@/features/auth/server';
import { sectorsService } from '@/services/catalog.service';
import type { ActionResult } from '@/types/common';
import { sectorSchema, type SectorFormValues } from '../schemas/sectorSchema';

export async function saveSector(id: string | null, values: SectorFormValues): Promise<ActionResult<unknown>> {
  const parsed = sectorSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  return adminMutation(['sectors'], () =>
    id ? sectorsService.update(id, parsed.data) : sectorsService.create(parsed.data),
  );
}

export async function deleteSector(id: string): Promise<ActionResult<unknown>> {
  return adminMutation(['sectors'], () => sectorsService.remove(id));
}
