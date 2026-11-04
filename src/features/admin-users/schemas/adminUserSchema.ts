import { z } from 'zod';

export const adminUserSchema = z.object({
  name: z.string().trim().min(1, 'Nome e email obrigatórios'),
  email: z.string().trim().pipe(z.email('E-mail inválido')),
  profileId: z.string().min(1, 'Escolha um perfil'),
  /** '' in the form = all sectors. */
  sectorId: z.string(),
  active: z.boolean(),
  /** PROVISIONAL, until Microsoft SSO. Empty on edit keeps the current one. */
  password: z.string().refine((v) => v === '' || v.length >= 6, 'A senha precisa de pelo menos 6 caracteres'),
});

export type AdminUserFormValues = z.infer<typeof adminUserSchema>;
export const emptyAdminUser: AdminUserFormValues = {
  name: '',
  email: '',
  profileId: '',
  sectorId: '',
  active: true,
  password: '',
};
