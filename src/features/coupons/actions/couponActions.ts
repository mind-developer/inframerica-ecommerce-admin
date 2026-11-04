'use server';

import { adminMutation } from '@/features/auth/server';
import { couponsService } from '@/services/commerce.service';
import type { ActionResult } from '@/types/common';
import type { CouponInput } from '@/types/coupons';
import { couponSchema, type CouponFormValues } from '../schemas/couponSchema';

export async function saveCoupon(id: string | null, values: CouponFormValues): Promise<ActionResult<unknown>> {
  const parsed = couponSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  const { validUntil, customerId, ...rest } = parsed.data;
  const input: CouponInput = { ...rest, validUntil: validUntil || null, customerId: customerId || null };
  const taken = (await couponsService.list()).some((c) => c.code === input.code && c.id !== id);
  if (taken) return { ok: false, error: 'Já existe um cupom com este código' };
  return adminMutation(
    'coupons',
    ['coupons'],
    () => (id ? couponsService.update(id, input) : couponsService.create(input)),
    ['coupons'],
  );
}

export async function deleteCoupon(id: string): Promise<ActionResult<unknown>> {
  return adminMutation('coupons', ['coupons'], () => couponsService.remove(id), ['coupons']);
}
