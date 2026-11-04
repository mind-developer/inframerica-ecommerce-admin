'use server';

import { refresh } from 'next/cache';
import { adminMutation } from '@/features/auth/server';
import { createProfile, removeProfile, updateProfile } from '@/services/access.service';
import type { ActionResult } from '@/types/common';
import { profileSchema, type ProfileFormValues } from '../schemas/profileSchema';

const refreshed = <T>(result: ActionResult<T>) => {
  if (result.ok) refresh();
  return result;
};

export async function saveProfile(id: string | null, values: ProfileFormValues): Promise<ActionResult<unknown>> {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  return refreshed(
    await adminMutation('permissions', [], () => (id ? updateProfile(id, parsed.data) : createProfile(parsed.data))),
  );
}

export async function deleteProfile(id: string): Promise<ActionResult<unknown>> {
  return refreshed(await adminMutation('permissions', [], () => removeProfile(id)));
}
