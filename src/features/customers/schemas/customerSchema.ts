import { z } from 'zod';

const digitCount = (value: string) => value.replace(/\D/g, '').length;

export const customerSchema = z
  .object({
    name: z.string().trim().min(1, 'Nome é obrigatório'),
    email: z.string().trim().min(1, 'Email é obrigatório').pipe(z.email('E-mail inválido')),
    phone: z.string().trim(),
    company: z.string().trim(),
    document: z
      .string()
      .trim()
      .refine((v) => digitCount(v) <= 11, 'CPF inválido'),
    cnpj: z.string().trim(),
    category: z.enum(['individual', 'company', 'public_agency']),
    billingTag: z.enum(['paying', 'account_holder', 'exempt']),
    address: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim().max(2, 'Use a sigla do estado'),
    zipCode: z
      .string()
      .trim()
      .refine((v) => digitCount(v) <= 8, 'CEP inválido'),
    stateRegistration: z.string().trim(),
  })
  .refine((c) => c.category === 'individual' || digitCount(c.cnpj) === 14, {
    message: 'CNPJ é obrigatório para esta categoria',
    path: ['cnpj'],
  });

export type CustomerFormValues = z.infer<typeof customerSchema>;

/** A coupon sent to one customer by e-mail (never public). */
export const targetedCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, 'Informe o código do cupom')
      .transform((v) => v.toUpperCase()),
    type: z.enum(['percent', 'fixed']),
    value: z.number().gt(0, 'Valor de desconto inválido'),
    maxUses: z.number().int().min(0).nullable(),
  })
  .refine((c) => c.type !== 'percent' || c.value <= 100, { message: 'Valor de desconto inválido', path: ['value'] });

export type TargetedCouponValues = z.input<typeof targetedCouponSchema>;
export const emptyTargetedCoupon: TargetedCouponValues = { code: '', type: 'percent', value: 10, maxUses: null };
