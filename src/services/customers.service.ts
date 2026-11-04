/** Real customers, from inframerica-ecommerce-api. Orders, coupons and the dashboard still use the mock ones. */
import 'server-only';
import type { Customer, CustomerInput } from '@/types/customers';
import { adminRead, adminWrite } from './api/adminApi';

const notFound = 'Cliente não encontrado';
const conflicts = {
  'email-taken': 'Já existe um cliente com este email',
  'cnpj-taken': 'Já existe um cliente com este CNPJ',
};

export const listCustomers = () => adminRead<Customer[]>('/admin/customers');

export const updateCustomer = (id: string, values: CustomerInput) =>
  adminWrite(`/admin/customers/${id}`, 'PATCH', { body: values, conflicts, notFound });

export const mailPasswordLink = (id: string) =>
  adminWrite(`/admin/customers/${id}/password-email`, 'POST', { notFound });

export async function createPasswordLink(id: string) {
  const body = await adminWrite<{ url: string }>(`/admin/customers/${id}/password-link`, 'POST', { notFound });
  return body?.url ?? '';
}

export const removeCustomer = (id: string) => adminWrite(`/admin/customers/${id}`, 'DELETE', { notFound });
