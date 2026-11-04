import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome do perfil'),
  permissions: z.array(z.string()),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
