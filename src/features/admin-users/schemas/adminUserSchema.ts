import { z } from 'zod';

export const ADMIN_ROLES = ['super_admin', 'admin', 'operator', 'finance'] as const;

export const adminUserSchema = z.object({
  name: z.string().trim().min(1, 'Nome e email obrigatórios'),
  email: z.string().trim().pipe(z.email('E-mail inválido')),
  role: z.enum(ADMIN_ROLES),
  /** '' in the form = all sectors. */
  sectorId: z.string(),
  active: z.boolean(),
});

export type AdminUserFormValues = z.infer<typeof adminUserSchema>;
export const emptyAdminUser: AdminUserFormValues = {
  name: '',
  email: '',
  role: 'operator',
  sectorId: '',
  active: true,
};
