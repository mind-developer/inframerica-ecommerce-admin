import { couponsService, paymentLinksService } from './commerce.service';
import { resetDb } from './mock/db';

beforeEach(() => resetDb());

describe('couponsService.create', () => {
  it('upper-cases the code and starts with zero uses', async () => {
    const c = await couponsService.create({
      code: ' vip10 ',
      description: '',
      type: 'percent',
      value: 10,
      validUntil: null,
      maxUses: null,
      courseIds: [],
      minimumAmount: 0,
      active: true,
      customerId: null,
    });
    expect(c).toMatchObject({ code: 'VIP10', uses: 0 });
  });
});

describe('paymentLinksService.create', () => {
  it('generates the public URL from the id', async () => {
    const l = await paymentLinksService.create({
      customerId: 'cli-1',
      email: 'a@x.com',
      description: 'X',
      amount: 10,
      status: 'draft',
      sentAt: null,
      paidAt: null,
    });
    expect(l.url).toBe(`https://pay.inframerica.aero/pay/${l.id.slice(4)}`);
  });
});
