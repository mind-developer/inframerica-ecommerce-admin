/** Real customers, from inframerica-ecommerce-api. Orders, coupons and the dashboard still use the mock ones. */
import 'server-only';
import type { Customer, CustomerInput, BillingTag } from '@/types/customers';
import type { Page } from '@/types/common';
import { adminFind, adminRead, adminWrite } from './api/adminApi';

const notFound = 'Cliente não encontrado';
const conflicts = {
  'email-taken': 'Já existe um cliente com este email',
  'cnpj-taken': 'Já existe um cliente com este CNPJ',
};

/** One page of the Clientes list, filtered by the API like the screen asks (search box and billing tag). */
export function listCustomers({ q, tag, page }: { q: string; tag: BillingTag | null; page: number }) {
  const query = new URLSearchParams();
  if (q) query.set('q', q);
  if (tag) query.set('tag', tag);
  if (page > 1) query.set('page', String(page));
  return adminRead<Page<Customer>>(`/admin/customers${query.size ? `?${query}` : ''}`);
}

/** One customer, for `?id=` links that may point off the current page. */
export const getCustomer = (id: string) => adminFind<Customer>(`/admin/customers/${encodeURIComponent(id)}`);

export const updateCustomer = (id: string, values: CustomerInput) =>
  adminWrite(`/admin/customers/${id}`, 'PATCH', { body: values, conflicts, notFound });

export const mailPasswordLink = (id: string) =>
  adminWrite(`/admin/customers/${id}/password-email`, 'POST', { notFound });

export async function createPasswordLink(id: string) {
  const body = await adminWrite<{ url: string }>(`/admin/customers/${id}/password-link`, 'POST', { notFound });
  return body?.url ?? '';
}

export const removeCustomer = (id: string) => adminWrite(`/admin/customers/${id}`, 'DELETE', { notFound });
