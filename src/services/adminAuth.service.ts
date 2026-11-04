/**
 * Admin authentication. PROVISIONAL: the e-mail/password check is done by inframerica-ecommerce-api
 * (`POST /auth/admin/login`), but the client signs in with Microsoft SSO, which replaces it.
 * The panel keeps its own signed session cookie plus the API's token; who the admin is and what they
 * may do is read from the API on each request, so a changed profile counts at once.
 */
import 'server-only';
import type { AdminSessionUser } from '@/types/auth';
import { apiRequest } from './api/apiClient';
import { getApiToken } from './session.service';

/** null for wrong credentials or an inactive admin; throws ApiUnavailableError when the API is down. */
export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<(AdminSessionUser & { accessToken: string }) | null> {
  const r = await apiRequest<{ accessToken: string; user: AdminSessionUser }>('/auth/admin/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
  });
  return r.status === 200 && r.body ? { ...r.body.user, accessToken: r.body.accessToken } : null;
}

/** The admin behind this request's token, only while still active. */
export async function findCurrentAdmin(): Promise<AdminSessionUser | null> {
  const token = await getApiToken();
  if (!token) return null;
  const r = await apiRequest<AdminSessionUser>('/auth/admin/me', { token });
  return r.status === 200 ? r.body : null;
}
