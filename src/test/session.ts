import { SESSION_COOKIE, signSession } from '@/services/session.service';
import { cookieJar } from './cookieJar';

/** Signs a user in for server-action tests. */
export function signInAs(userId: string) {
  cookieJar.set(SESSION_COOKIE, signSession(userId, Date.now() + 60_000));
}
