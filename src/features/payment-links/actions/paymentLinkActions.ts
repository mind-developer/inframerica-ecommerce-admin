'use server';

import { adminMutation } from '@/features/auth/server';
import { ordersService, paymentLinksService } from '@/services/commerce.service';
import type { ActionResult } from '@/types/common';
import type { PaymentLink } from '@/types/paymentLinks';
import { paymentLinkSchema, type PaymentLinkFormValues } from '../schemas/paymentLinkSchema';

/** Creates the link as a draft, or creates and "sends" it (the e-mail is simulated). */
export async function createPaymentLink(
  values: PaymentLinkFormValues,
  sendNow: boolean,
): Promise<ActionResult<PaymentLink>> {
  const parsed = paymentLinkSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' };
  const { message: _message, ...rest } = parsed.data;
  return adminMutation(['payment-links'], () =>
    paymentLinksService.create({
      ...rest,
      status: sendNow ? 'sent' : 'draft',
      sentAt: sendNow ? new Date().toISOString() : null,
      paidAt: null,
    }),
  );
}

export async function sendPaymentLink(id: string): Promise<ActionResult<PaymentLink>> {
  return adminMutation(['payment-links'], () =>
    paymentLinksService.update(id, { status: 'sent', sentAt: new Date().toISOString() }),
  );
}

/** Confirms the payment and registers it as a paid order (PIX), like the prototype. */
export async function markPaymentLinkPaid(id: string): Promise<ActionResult<PaymentLink>> {
  return adminMutation(['payment-links', 'orders'], async () => {
    const paidAt = new Date().toISOString();
    const link = await paymentLinksService.update(id, { status: 'paid', paidAt });
    if (link.customerId) {
      await ordersService.create({
        customerId: link.customerId,
        description: link.description,
        amount: link.amount,
        method: 'pix',
        status: 'paid',
        reference: `LINK-${link.id.slice(4, 12)}`,
        paidAt,
        items: [],
      });
    }
    return link;
  });
}

export async function deletePaymentLink(id: string): Promise<ActionResult<unknown>> {
  return adminMutation(['payment-links'], () => paymentLinksService.remove(id));
}
