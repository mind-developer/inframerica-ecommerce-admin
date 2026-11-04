'use server';

import { refresh } from 'next/cache';
import { adminMutation } from '@/features/auth/server';
import { createAdminUser, removeAdminUser, updateAdminUser } from '@/services/access.service';
import type { ActionResult } from '@/types/common';
import { adminUserSchema, type AdminUserFormValues } from '../schemas/adminUserSchema';

const refreshed = <T>(result: ActionResult<T>) => {
  if (result.ok) refresh();
  return result;
};

export async function saveAdminUser(id: string | null, values: AdminUserFormValues): Promise<ActionResult<unknown>> {
  const parsed = adminUserSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  const input = { ...parsed.data, sectorId: parsed.data.sectorId || null };
  return refreshed(await adminMutation('users', [], () => (id ? updateAdminUser(id, input) : createAdminUser(input))));
}

export async function deleteAdminUser(id: string): Promise<ActionResult<unknown>> {
  return refreshed(await adminMutation('users', [], () => removeAdminUser(id)));
}
