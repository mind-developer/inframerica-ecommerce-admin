'use server';

import { refresh } from 'next/cache';
import { adminMutation } from '@/features/auth/server';
import { couponsService } from '@/services/commerce.service';
import { createPasswordLink, mailPasswordLink, removeCustomer, updateCustomer } from '@/services/customers.service';
import type { ActionResult } from '@/types/common';
import type { Coupon } from '@/types/coupons';
import {
  customerSchema,
  targetedCouponSchema,
  type CustomerFormValues,
  type TargetedCouponValues,
} from '../schemas/customerSchema';

const fail = (error: string) => ({ ok: false as const, error });

/** The API keeps e-mail and CNPJ unique; customers themselves are created by the store's sign-up. */
export async function saveCustomer(id: string, values: CustomerFormValues): Promise<ActionResult<unknown>> {
  const parsed = customerSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Dados inválidos');
  const result = await adminMutation([], () => updateCustomer(id, parsed.data));
  if (result.ok) refresh();
  return result;
}

export async function deleteCustomer(id: string): Promise<ActionResult<unknown>> {
  const result = await adminMutation([], () => removeCustomer(id));
  if (result.ok) refresh();
  return result;
}

/** Mails the customer a real link to create a password (valid for 1 hour). */
export async function sendPasswordEmail(id: string): Promise<ActionResult<unknown>> {
  return adminMutation([], () => mailPasswordLink(id));
}

/** A link to hand over by another channel; it replaces any link sent before. */
export async function generatePasswordLink(id: string): Promise<ActionResult<string>> {
  return adminMutation([], () => createPasswordLink(id));
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
