import { SESSION_COOKIE, signSession } from '@/services/session.service';
import { SCREENS } from '@/constants/access';
import type { AdminSessionUser } from '@/types/auth';
import { cookieJar } from './cookieJar';

/** Who action tests run as, unless a test says otherwise. */
export const ownerSession: AdminSessionUser = {
  id: 'usr-0',
  name: 'Administrador Inframérica',
  email: 'admin@inframerica.com',
  owner: true,
  sectorId: null,
  profile: null,
  permissions: SCREENS.flatMap((s) => [`${s.resource}.read`, `${s.resource}.manage`]),
};

/** Signs a user in for server-action tests. */
export function signInAs(userId: string) {
  cookieJar.set(SESSION_COOKIE, signSession(userId, Date.now() + 60_000));
}
