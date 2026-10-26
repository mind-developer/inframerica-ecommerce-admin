import { z } from 'zod';

export const storeSettingsSchema = z.object({
  storeClosed: z.boolean(),
  message: z.string().trim().min(1, 'Informe a mensagem da tela de manutenção'),
  contactChannel: z.string().trim().min(1, 'Informe o canal de contato'),
  mode: z.enum(['hide_menu', 'block_checkout_only']),
  notifyOnReopen: z.boolean(),
});

export type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;
