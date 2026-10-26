import { z } from 'zod';

export const paymentLinkSchema = z.object({
  customerId: z.string().min(1, 'Selecione um cliente'),
  email: z.string().trim().pipe(z.email('Informe um e-mail válido')),
  description: z.string().trim().min(1, 'Informe a descrição da cobrança'),
  amount: z.number().gt(0, 'Informe o valor'),
  /** Shown in the e-mail (mock: not stored). */
  message: z.string(),
});

export type PaymentLinkFormValues = z.infer<typeof paymentLinkSchema>;
