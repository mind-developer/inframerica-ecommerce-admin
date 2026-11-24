/** Credentials, from inframerica-ecommerce-api (#69). */
import 'server-only';
import type { Credential, CredentialInput } from '@/types/catalog';
import type { Id } from '@/types/common';
import { adminRead, adminWrite } from './api/adminApi';

const notFound = 'Credencial não encontrada';
const conflicts = {
  'unknown-sector': 'Um dos setores escolhidos não existe mais',
  'credential-in-use': 'Esta credencial está vinculada a cursos. Desvincule-a dos cursos antes de remover.',
};

export const credentialsService = {
  /** Every credential, inactive ones too. */
  list: () => adminRead<Credential[]>('/admin/credentials'),

  create: (input: CredentialInput) =>
    adminWrite<Credential>('/admin/credentials', 'POST', { body: input, conflicts, notFound }),

  update: (id: Id, input: CredentialInput) =>
    adminWrite<Credential>(`/admin/credentials/${id}`, 'PATCH', { body: input, conflicts, notFound }),

  remove: async (id: Id) => {
    await adminWrite(`/admin/credentials/${id}`, 'DELETE', { conflicts, notFound });
  },
};
