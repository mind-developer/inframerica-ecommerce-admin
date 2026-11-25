/**
 * The Microsoft sign-in in progress, in a short-lived httpOnly cookie of the browser that started it: only that
 * browser can finish it, once.
 */
import 'server-only';
import { cookies } from 'next/headers';
import { ENTRA_COOKIE } from '@/constants/session';
import { secureCookies } from '@/utils/secureCookies';

export interface EntraAttempt {
  state: string;
  nonce: string;
  codeVerifier: string;
  redirectTo: string;
}

const PATH = '/auth/entra';
const MAX_AGE_SECONDS = 10 * 60;

export async function keepEntraAttempt(attempt: EntraAttempt): Promise<void> {
  (await cookies()).set(ENTRA_COOKIE, JSON.stringify(attempt), {
    httpOnly: true,
    // Lax: Microsoft brings the browser back with a top-level GET.
    sameSite: 'lax',
    secure: secureCookies(),
    path: PATH,
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function takeEntraAttempt(): Promise<EntraAttempt | null> {
  const jar = await cookies();
  const raw = jar.get(ENTRA_COOKIE)?.value;
  jar.delete({ name: ENTRA_COOKIE, path: PATH });
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EntraAttempt;
  } catch {
    return null;
  }
}
