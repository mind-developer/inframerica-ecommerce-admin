'use server';

import { adminMutation } from '@/features/auth/server';
import { adminUsersService } from '@/services/commerce.service';
import type { ActionResult } from '@/types/common';
import { adminUserSchema, type AdminUserFormValues } from '../schemas/adminUserSchema';

export async function saveAdminUser(id: string | null, values: AdminUserFormValues): Promise<ActionResult<unknown>> {
  const parsed = adminUserSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  const input = { ...parsed.data, sectorId: parsed.data.sectorId || null };
  return adminMutation(['admin-users'], () =>
    id ? adminUsersService.update(id, input) : adminUsersService.create(input),
  );
}

export async function deleteAdminUser(id: string): Promise<ActionResult<unknown>> {
  return adminMutation(['admin-users'], () => adminUsersService.remove(id));
}
