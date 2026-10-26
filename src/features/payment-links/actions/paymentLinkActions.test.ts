import { ordersService, paymentLinksService } from '@/services/commerce.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { createPaymentLink, markPaymentLinkPaid, sendPaymentLink } from './paymentLinkActions';

const values = { customerId: 'cli-4', email: 'a@x.com', description: 'Cobrança', amount: 99.9, message: '' };

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('payment link actions', () => {
  it('creates a draft, sends it and marks it paid, registering a paid order', async () => {
    const created = await createPaymentLink(values, false);
    expect(created).toMatchObject({ ok: true, data: { status: 'draft', sentAt: null } });
    const id = created.ok ? created.data.id : '';
    expect((await sendPaymentLink(id)).ok).toBe(true);
    expect((await paymentLinksService.get(id))?.status).toBe('sent');
    const before = (await ordersService.list()).length;
    await markPaymentLinkPaid(id);
    const orders = await ordersService.list();
    expect(orders).toHaveLength(before + 1);
    expect(orders.at(-1)).toMatchObject({
      customerId: 'cli-4',
      amount: 99.9,
      status: 'paid',
      method: 'pix',
      items: [],
    });
  });

  it('creates and sends at once', async () => {
    expect(await createPaymentLink(values, true)).toMatchObject({ ok: true, data: { status: 'sent' } });
  });

  it('validates amount and e-mail', async () => {
    expect((await createPaymentLink({ ...values, amount: 0 }, false)).ok).toBe(false);
    expect((await createPaymentLink({ ...values, email: 'x' }, false)).ok).toBe(false);
  });
});
