/** Real customers, from inframerica-ecommerce-api. Orders, coupons and the dashboard still use the mock ones. */
import 'server-only';
import type { Customer, CustomerInput, BillingTag } from '@/types/customers';
import { adminRead, adminWrite } from './api/adminApi';

const notFound = 'Cliente não encontrado';
const conflicts = {
  'email-taken': 'Já existe um cliente com este email',
  'cnpj-taken': 'Já existe um cliente com este CNPJ',
};

/** The Clientes list, filtered by the API like the screen asks (search box and billing tag). */
export function listCustomers({ q, tag }: { q: string; tag: BillingTag | null }) {
  const query = new URLSearchParams();
  if (q) query.set('q', q);
  if (tag) query.set('tag', tag);
  return adminRead<Customer[]>(`/admin/customers${query.size ? `?${query}` : ''}`);
}

export const updateCustomer = (id: string, values: CustomerInput) =>
  adminWrite(`/admin/customers/${id}`, 'PATCH', { body: values, conflicts, notFound });

export const mailPasswordLink = (id: string) =>
  adminWrite(`/admin/customers/${id}/password-email`, 'POST', { notFound });

export async function createPasswordLink(id: string) {
  const body = await adminWrite<{ url: string }>(`/admin/customers/${id}/password-link`, 'POST', { notFound });
  return body?.url ?? '';
}

export const removeCustomer = (id: string) => adminWrite(`/admin/customers/${id}`, 'DELETE', { notFound });
