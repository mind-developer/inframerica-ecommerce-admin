'use server';

import { redirect } from 'next/navigation';
import { verifyAdminCredentials } from '@/services/adminAuth.service';
import { endSession, startSession } from '@/services/session.service';
import { signInSchema, type SignInValues } from '../schemas/signInSchema';

const INVALID = 'E-mail ou senha inválidos, ou conta sem acesso administrativo ativo';

export async function signIn(values: SignInValues): Promise<{ error: string } | undefined> {
  const parsed = signInSchema.safeParse(values);
  const admin = parsed.success ? await verifyAdminCredentials(parsed.data.email, parsed.data.password) : null;
  if (!admin) return { error: INVALID };
  await startSession(admin.id);
  redirect('/');
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect('/login');
}
