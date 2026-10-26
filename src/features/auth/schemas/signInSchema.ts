import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail').pipe(z.email('E-mail inválido')),
  password: z.string().min(4, 'A senha precisa de pelo menos 4 caracteres'),
});

export type SignInValues = z.infer<typeof signInSchema>;
