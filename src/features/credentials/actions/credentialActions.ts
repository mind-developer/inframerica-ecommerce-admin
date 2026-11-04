'use server';

import { adminMutation } from '@/features/auth/server';
import { credentialsService } from '@/services/catalog.service';
import type { ActionResult } from '@/types/common';
import { credentialSchema, type CredentialFormValues } from '../schemas/credentialSchema';

/** Credentials feed the store's credential filter, so the storefront is told too. */
export async function saveCredential(id: string | null, values: CredentialFormValues): Promise<ActionResult<unknown>> {
  const parsed = credentialSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  return adminMutation(
    'credentials',
    ['credentials'],
    () => (id ? credentialsService.update(id, parsed.data) : credentialsService.create(parsed.data)),
    ['credentials'],
  );
}

export async function deleteCredential(id: string): Promise<ActionResult<unknown>> {
  return adminMutation('credentials', ['credentials'], () => credentialsService.remove(id), ['credentials']);
}
