'use server';

import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { verifyAdminCredentials } from '@/services/adminAuth.service';
import { ApiUnavailableError } from '@/services/api/apiClient';
import { endSession, startSession } from '@/services/session.service';
import { signInSchema, type SignInValues } from '../schemas/signInSchema';
import { safeRedirect } from '../utils/safeRedirect';

const INVALID = 'E-mail ou senha inválidos, ou conta sem acesso administrativo ativo';

const UNAVAILABLE = 'Não foi possível entrar agora. Tente novamente em instantes.';

async function checkCredentials(values: SignInValues) {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) return null;
  try {
    return await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  } catch (error) {
    if (error instanceof ApiUnavailableError) return 'unavailable' as const;
    throw error;
  }
}

/** `redirectTo`: the page the admin was heading to; only paths of this site are followed. */
export async function signIn(values: SignInValues, redirectTo?: string | null): Promise<{ error: string } | undefined> {
  const admin = await checkCredentials(values);
  if (admin === 'unavailable') return { error: UNAVAILABLE };
  if (!admin) return { error: INVALID };
  await startSession(admin.id, admin.accessToken);
  redirect(safeRedirect(redirectTo) as Route);
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect('/login');
}
