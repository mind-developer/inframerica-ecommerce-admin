/**
 * Admin authentication, done by inframerica-ecommerce-api: Microsoft Entra ID and, while it is on, e-mail and
 * password. The panel keeps its own signed session cookie plus the API's token; who the admin is and what they
 * may do is read from the API on each request, so a changed profile counts at once.
 */
import 'server-only';
import { connection } from 'next/server';
import type { AdminSessionUser, LoginMethods } from '@/types/auth';
import { ApiUnavailableError, apiRequest } from './api/apiClient';
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

/** Which sign-in methods to offer. With the API down, the password form is shown and says so on submit. */
export async function getLoginMethods(): Promise<LoginMethods> {
  await connection();
  try {
    const r = await apiRequest<LoginMethods>('/auth/admin/methods');
    if (r.status === 200 && r.body) return r.body;
  } catch (error) {
    if (!(error instanceof ApiUnavailableError)) throw error;
  }
  return { microsoft: false, password: true };
}

/** null when Microsoft sign-in isn't configured. */
export async function startEntraSignIn() {
  const r = await apiRequest<{ authorizationUrl: string; state: string; nonce: string; codeVerifier: string }>(
    '/auth/admin/entra/start',
    { method: 'POST' },
  );
  return r.status === 200 ? r.body : null;
}

type AdminSession = { accessToken: string; user: AdminSessionUser };

export async function finishEntraSignIn(body: {
  code: string;
  state: string;
  nonce: string;
  codeVerifier: string;
}): Promise<AdminSession | { refused: string | undefined }> {
  const r = await apiRequest<AdminSession & { status?: string }>('/auth/admin/entra/callback', {
    method: 'POST',
    body,
  });
  return r.status === 200 && r.body ? r.body : { refused: r.body?.status };
}
