import { z } from 'zod';

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, 'Informe o código do cupom')
      .transform((v) => v.toUpperCase()),
    description: z.string().trim(),
    type: z.enum(['percent', 'fixed']),
    value: z.number().gt(0, 'O valor do desconto deve ser maior que zero'),
    /** '' = no expiry. */
    validUntil: z.string(),
    maxUses: z.number().int().min(0).nullable(),
    minimumAmount: z.number().min(0),
    courseIds: z.array(z.string()),
    /** '' = public coupon. */
    customerId: z.string(),
    active: z.boolean(),
  })
  .refine((c) => c.type !== 'percent' || c.value <= 100, {
    message: 'Desconto percentual não pode passar de 100%',
    path: ['value'],
  });

export type CouponFormValues = z.input<typeof couponSchema>;

export const emptyCoupon: CouponFormValues = {
  code: '',
  description: '',
  type: 'percent',
  value: 10,
  validUntil: '',
  maxUses: null,
  minimumAmount: 0,
  courseIds: [],
  customerId: '',
  active: true,
};
