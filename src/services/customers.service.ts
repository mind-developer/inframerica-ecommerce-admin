/** Real customers, from inframerica-ecommerce-api. Orders, coupons and the dashboard still use the mock ones. */
import 'server-only';
import { redirect } from 'next/navigation';
import type { Customer, CustomerInput } from '@/types/customers';
import { apiRequest } from './api/apiClient';
import { getApiToken } from './session.service';

const EXPIRED = 'Sessão expirada. Entre novamente.';
const CONFLICT: Record<string, string> = {
  'email-taken': 'Já existe um cliente com este email',
  'cnpj-taken': 'Já existe um cliente com este CNPJ',
};

export async function listCustomers(): Promise<Customer[]> {
  const token = await getApiToken();
  if (!token) redirect('/login');
  const r = await apiRequest<Customer[]>('/admin/customers', { token });
  if (r.status === 401) redirect('/login');
  return r.body ?? [];
}

/** Runs a write with the admin's API token; refusals become user-facing errors. */
async function write(path: string, method: 'PATCH' | 'DELETE', body?: unknown) {
  const token = await getApiToken();
  if (!token) throw new Error(EXPIRED);
  const r = await apiRequest<{ status?: string }>(path, { method, body, token });
  if (r.status === 401) throw new Error(EXPIRED);
  if (r.status === 404) throw new Error('Cliente não encontrado');
  if (r.status >= 400) throw new Error(CONFLICT[r.body?.status ?? ''] ?? 'Dados inválidos');
}

export const updateCustomer = (id: string, values: CustomerInput) =>
  write(`/admin/customers/${id}`, 'PATCH', values);

export const removeCustomer = (id: string) => write(`/admin/customers/${id}`, 'DELETE');
