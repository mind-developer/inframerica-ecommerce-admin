import 'server-only';
import type { AdminUser, AdminUserInput } from '@/types/adminUsers';
import type { Cohort, CohortInput } from '@/types/cohorts';
import type { Concessionaire } from '@/types/concessionaires';
import type { Coupon, CouponInput } from '@/types/coupons';
import type { Customer, CustomerInput } from '@/types/customers';
import type { Order, OrderInput } from '@/types/orders';
import type { PaymentLink, PaymentLinkInput } from '@/types/paymentLinks';
import { createCrudService } from './mock/crud';
import { getDb } from './mock/db';
import { latency, newId, nowIso } from './mock/table';

export const customersService = createCrudService<Customer, CustomerInput>(
  () => getDb().customers,
  (input) => ({ ...input, createdAt: nowIso().slice(0, 10) }),
  'cli',
);

/** Coupons: codes are stored upper-case and start unused. */
export const couponsService = createCrudService<Coupon, CouponInput>(
  () => getDb().coupons,
  (input) => ({ ...input, code: input.code.trim().toUpperCase(), uses: 0, createdAt: nowIso() }),
  'cup',
);

export const ordersService = createCrudService<Order, OrderInput>(
  () => getDb().orders,
  (input) => ({ ...input, createdAt: nowIso() }),
  'pag',
);

export const cohortsService = createCrudService<Cohort, CohortInput>(
  () => getDb().cohorts,
  (input) => ({ ...input }),
  'tur',
);

export const adminUsersService = createCrudService<AdminUser, AdminUserInput>(
  () => getDb().adminUsers,
  (input) => ({ ...input, createdAt: nowIso().slice(0, 10) }),
  'usr',
);

const PAY_BASE = 'https://pay.inframerica.aero/pay';

/** Payment links: the server generates the public URL. */
export const paymentLinksService = {
  ...createCrudService<PaymentLink, PaymentLinkInput>(
    () => getDb().paymentLinks,
    (input) => ({ ...input, url: '', createdAt: nowIso() }),
    'lnk',
  ),
  async create(input: PaymentLinkInput): Promise<PaymentLink> {
    await latency();
    const id = newId('lnk');
    return getDb().paymentLinks.insert({ ...input, id, url: `${PAY_BASE}/${id.slice(4)}`, createdAt: nowIso() });
  },
};

export async function listConcessionaires(): Promise<Concessionaire[]> {
  await latency();
  return getDb().concessionaires.all();
}
