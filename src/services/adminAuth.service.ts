/**
 * Admin authentication. PROVISIONAL: the e-mail/password check is done by inframerica-ecommerce-api
 * (`POST /auth/admin/login`), but the client signs in with Microsoft SSO, which replaces all of this.
 * Until then the panel keeps its own signed session cookie, and "still active" is read from the mock
 * admin users (the "Usuários" screen edits them), so an admin must exist in both, as in the seeds.
 */
import 'server-only';
import type { AdminSessionUser } from '@/types/auth';
import { apiRequest } from './api/apiClient';
import { getDb } from './mock/db';

const toSession = ({ id, name, email, role }: AdminSessionUser): AdminSessionUser => ({ id, name, email, role });

/** null for wrong credentials or an inactive admin; throws ApiUnavailableError when the API is down. */
export async function verifyAdminCredentials(email: string, password: string): Promise<AdminSessionUser | null> {
  const r = await apiRequest<{ user: AdminSessionUser }>('/auth/admin/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
  });
  return r.status === 200 && r.body ? toSession(r.body.user) : null;
}

/** The admin behind a session, only while still active. */
export async function findActiveAdmin(id: string): Promise<AdminSessionUser | null> {
  const user = getDb().adminUsers.find(id);
  return user?.active ? toSession(user) : null;
}
