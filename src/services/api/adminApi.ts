/** Calls the API with the signed-in admin's token. Server-side only. */
import 'server-only';
import { redirect } from 'next/navigation';
import { getApiToken } from '../session.service';
import { apiRequest } from './apiClient';

const EXPIRED = 'Sessão expirada. Entre novamente.';
const NOT_ALLOWED = 'Você não tem permissão para esta ação.';

/** For page reads: no valid token sends the admin back to sign in. */
export async function adminRead<T>(path: string): Promise<T> {
  const token = await getApiToken();
  if (!token) redirect('/login');
  const r = await apiRequest<T>(path, { token });
  if (r.status === 403) redirect('/sem-acesso');
  if (r.status === 401 || !r.body) redirect('/login');
  return r.body;
}

/** For actions: refusals become user-facing errors, `conflicts` maps the API's 409 statuses. */
export async function adminWrite<T = unknown>(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  { body, conflicts = {}, notFound }: { body?: unknown; conflicts?: Record<string, string>; notFound: string },
) {
  const token = await getApiToken();
  if (!token) throw new Error(EXPIRED);
  const r = await apiRequest<T & { status?: string }>(path, { method, body, token });
  if (r.status === 401) throw new Error(EXPIRED);
  if (r.status === 404) throw new Error(notFound);
  if (r.status === 403 && r.body?.status === 'forbidden') throw new Error(NOT_ALLOWED);
  if (r.status >= 400) throw new Error(conflicts[r.body?.status ?? ''] ?? 'Dados inválidos');
  return r.body;
}
