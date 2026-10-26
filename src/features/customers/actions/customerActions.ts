'use server';

import { adminMutation } from '@/features/auth/server';
import { couponsService, customersService } from '@/services/commerce.service';
import type { ActionResult } from '@/types/common';
import type { Coupon } from '@/types/coupons';
import { onlyDigits } from '@/utils/format';
import {
  customerSchema,
  targetedCouponSchema,
  type CustomerFormValues,
  type TargetedCouponValues,
} from '../schemas/customerSchema';

const fail = (error: string) => ({ ok: false as const, error });

/** Updates a customer. E-mail and CNPJ must stay unique (customers are created by the store). */
export async function saveCustomer(id: string, values: CustomerFormValues): Promise<ActionResult<unknown>> {
  const parsed = customerSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Dados inválidos');
  const others = (await customersService.list()).filter((c) => c.id !== id);
  const data = parsed.data;
  if (others.some((c) => c.email.trim().toLowerCase() === data.email.toLowerCase()))
    return fail('Já existe um cliente com este email');
  // Seed companies keep their CNPJ in `document`, so both fields count as "this CNPJ is taken".
  const cnpj = onlyDigits(data.cnpj);
  if (cnpj && others.some((c) => [c.cnpj, c.document].some((d) => d && onlyDigits(d) === cnpj)))
    return fail('Já existe um cliente com este CNPJ');
  return adminMutation(['customers'], () => customersService.update(id, { ...data, sectorId: data.sectorId || null }));
}

export async function deleteCustomer(id: string): Promise<ActionResult<unknown>> {
  return adminMutation(['customers'], () => customersService.remove(id));
}

/** Creates a coupon only this customer can use (the e-mail is simulated). */
export async function createTargetedCoupon(
  customerId: string,
  customerName: string,
  values: TargetedCouponValues,
): Promise<ActionResult<Coupon>> {
  const parsed = targetedCouponSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Dados inválidos');
  if ((await couponsService.list()).some((c) => c.code === parsed.data.code))
    return fail('Já existe um cupom com este código');
  return adminMutation(
    ['coupons'],
    () =>
      couponsService.create({
        ...parsed.data,
        description: `Cupom direcionado para ${customerName}`,
        validUntil: null,
        courseIds: [],
        minimumAmount: 0,
        active: true,
        customerId,
      }),
    ['coupons'],
  );
}
