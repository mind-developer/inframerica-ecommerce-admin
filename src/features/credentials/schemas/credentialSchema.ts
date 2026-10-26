import { z } from 'zod';

export const credentialSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da credencial'),
  acronym: z
    .string()
    .trim()
    .min(1, 'Informe a sigla')
    .transform((v) => v.toUpperCase()),
  description: z.string().trim(),
  validityMonths: z.number().int().min(0, 'Validade não pode ser negativa'),
  sectorIds: z.array(z.string()).min(1, 'Vincule a credencial a pelo menos um setor'),
  active: z.boolean(),
});

export type CredentialFormValues = z.input<typeof credentialSchema>;
export const emptyCredential: CredentialFormValues = {
  name: '',
  acronym: '',
  description: '',
  validityMonths: 12,
  sectorIds: [],
  active: true,
};
