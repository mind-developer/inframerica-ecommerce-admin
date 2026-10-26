import { z } from 'zod';

export const sectorSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do setor'),
  description: z.string().trim(),
  manager: z.string().trim(),
  active: z.boolean(),
});

export type SectorFormValues = z.infer<typeof sectorSchema>;
export const emptySector: SectorFormValues = { name: '', description: '', manager: '', active: true };
