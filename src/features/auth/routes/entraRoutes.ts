import 'server-only';
import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { finishEntraSignIn, startEntraSignIn } from '@/services/adminAuth.service';
import { ApiUnavailableError } from '@/services/api/apiClient';
import { keepEntraAttempt, takeEntraAttempt } from '@/services/entraAttempt.service';
import { startSession } from '@/services/session.service';
import { fromApiStatus, type EntraError } from '../utils/entraErrors';
import { safeRedirect } from '../utils/safeRedirect';

const backToLogin = (error: EntraError, redirectTo = '/') => {
  const query = new URLSearchParams({ erro: error });
  if (redirectTo !== '/') query.set('redirect', redirectTo);
  return redirect(`/login?${query}` as Route);
};

/** null when the API can't be reached; anything unexpected still throws. */
async function orUnavailable<T>(call: Promise<T>): Promise<T | 'unavailable'> {
  try {
    return await call;
  } catch (error) {
    if (error instanceof ApiUnavailableError) return 'unavailable';
    throw error;
  }
}

/** `GET /auth/entra/start`: remembers this attempt in the browser and goes to Microsoft. */
export async function entraStart(request: Request): Promise<Response> {
  const redirectTo = safeRedirect(new URL(request.url).searchParams.get('redirect'));
  const started = await orUnavailable(startEntraSignIn());
  if (started === 'unavailable' || !started) return backToLogin('indisponivel', redirectTo);
  const { authorizationUrl, ...attempt } = started;
  await keepEntraAttempt({ ...attempt, redirectTo });
  return redirect(authorizationUrl as Route);
}

/** `GET /auth/entra/callback`: Microsoft brought the browser back. */
export async function entraCallback(request: Request): Promise<Response> {
  const query = new URL(request.url).searchParams;
  const attempt = await takeEntraAttempt();
  if (!attempt || attempt.state !== query.get('state')) return backToLogin('expirado');
  const redirectTo = safeRedirect(attempt.redirectTo);
  const code = query.get('code');
  if (!code) return backToLogin('cancelado', redirectTo);
  const { state, nonce, codeVerifier } = attempt;
  const result = await orUnavailable(finishEntraSignIn({ code, state, nonce, codeVerifier }));
  if (result === 'unavailable') return backToLogin('indisponivel', redirectTo);
  if ('refused' in result) return backToLogin(fromApiStatus(result.refused), redirectTo);
  await startSession(result.user.id, result.accessToken);
  return redirect(redirectTo as Route);
}
