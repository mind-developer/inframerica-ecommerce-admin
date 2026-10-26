import { customersSeed } from '@/mocks/customers';
import { enrollmentsSeed } from '@/mocks/enrollments';
import { ordersSeed } from '@/mocks/orders';
import { studentsOfOrder } from '@/domain/orderCourses';
import { coursesSeed } from '@/mocks/courses';
import { filterOrders, orderTotals, type OrderFilters } from './orderFilters';

const none: OrderFilters = {
  q: '',
  status: null,
  method: null,
  service: null,
  customerId: null,
  sort: 'recente',
  invoice: null,
  billed: null,
  excludeAccountHolders: false,
};
const ctx = {
  customerOf: (id: string) => customersSeed.find((c) => c.id === id),
  studentsOf: (o: (typeof ordersSeed)[number]) => studentsOfOrder(o, coursesSeed, enrollmentsSeed, customersSeed),
};
const ids = (f: Partial<OrderFilters>) => filterOrders(ordersSeed, { ...none, ...f }, ctx).map((o) => o.id);

describe('filterOrders', () => {
  it('sorts newest first by default, and by amount on demand', () => {
    expect(ids({})[0]).toBe('pag-10');
    expect(ids({ sort: 'antigo' })[0]).toBe('pag-1');
    expect(ids({ sort: 'maior' })[0]).toBe('pag-5');
  });

  it('filters by status, method, service and customer', () => {
    expect(ids({ status: 'refunded' })).toEqual(['pag-9']);
    expect(ids({ method: 'card' }).sort()).toEqual(['pag-4', 'pag-7']);
    expect(ids({ service: 'credentialing' })).toEqual(['pag-10']);
    expect(ids({ customerId: 'cli-2' }).sort()).toEqual(['pag-2', 'pag-9']);
  });

  it('searches customer documents by digits and linked people by name', () => {
    expect(ids({ q: '02012862000160' })).toEqual(['pag-1']);
    expect(ids({ q: 'ana beatriz' })).toContain('pag-1');
  });

  it('can leave monthly account holders out', () => {
    const accountHolders = customersSeed.filter((c) => c.billingTag === 'account_holder').map((c) => c.id);
    expect(
      filterOrders(ordersSeed, { ...none, excludeAccountHolders: true }, ctx).some((o) =>
        accountHolders.includes(o.customerId),
      ),
    ).toBe(false);
  });
});

describe('orderTotals', () => {
  it('sums gross, received (paid) and receivable (pending)', () => {
    const t = orderTotals(ordersSeed);
    expect(t.count).toBe(ordersSeed.length);
    expect(t.received).toBe(ordersSeed.filter((o) => o.status === 'paid').reduce((s, o) => s + o.amount, 0));
    expect(t.receivable).toBe(2400 + 9000);
  });
});
