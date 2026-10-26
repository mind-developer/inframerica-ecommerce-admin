import { describe, expect, it } from 'vitest';
import type { Course } from '@/types/catalog';
import type { Customer } from '@/types/customers';
import type { Order } from '@/types/orders';
import type { Sector } from '@/types/sectors';
import {
  DEFAULT_DASHBOARD_FILTERS,
  filterDashboardOrders,
  periodStart,
  salesByCourse,
  salesBySector,
  salesSummary,
  topCustomers,
} from './dashboardMetrics';

const NOW = new Date('2026-10-26T15:00:00-03:00');
const customers = [
  { id: 'pj', name: 'Acme', document: '12.345.678/0001-90', sectorId: 's1' },
  { id: 'pf', name: 'Bia', document: '123.456.789-09', sectorId: null },
] as Customer[];
const sectors = [{ id: 's1', name: 'Aviação' }] as Sector[];
const courses = [
  { id: 'k1', title: 'Segurança operacional' },
  { id: 'k2', title: 'Direção defensiva' },
] as Course[];
const order = (
  id: string,
  customerId: string,
  amount: number,
  createdAt: string,
  status: Order['status'] = 'paid',
  items: Order['items'] = [],
) => ({ id, customerId, amount, createdAt, status, items, description: 'Pedido avulso' }) as Order;

const orders = [
  order('o1', 'pj', 1000, '2026-10-20T10:00:00-03:00', 'paid', [
    { courseId: 'k1', quantity: 2, unitPrice: 300 },
    { courseId: 'k2', quantity: 1, unitPrice: 400 },
  ]),
  order('o2', 'pf', 500, '2026-10-01T10:00:00-03:00', 'pending'),
  order('o3', 'pf', 200, '2026-08-01T10:00:00-03:00', 'paid'),
  order('o4', 'pj', 900, '2025-12-31T10:00:00-03:00', 'refunded'),
  order('o5', 'pj', 300, '2026-09-30T23:30:00-03:00', 'paid'),
];

describe('periodStart', () => {
  it('returns the Brasília civil cut-off date, or null for all time', () => {
    expect(periodStart('tudo', NOW)).toBeNull();
    expect(periodStart('7d', NOW)).toBe('2026-10-19');
    expect(periodStart('30d', NOW)).toBe('2026-09-26');
    expect(periodStart('ano', NOW)).toBe('2026-01-01');
  });
});

describe('filterDashboardOrders', () => {
  const ids = (f: Partial<typeof DEFAULT_DASHBOARD_FILTERS>) =>
    filterDashboardOrders(orders, customers, { ...DEFAULT_DASHBOARD_FILTERS, ...f }, NOW).map((o) => o.id);
  it('filters by period, sector and PF/PJ (from the document length)', () => {
    expect(ids({})).toHaveLength(5);
    expect(ids({ period: '30d' })).toEqual(['o1', 'o2', 'o5']);
    expect(ids({ sectorId: 's1' })).toEqual(['o1', 'o4', 'o5']);
    expect(ids({ customerType: 'pf' })).toEqual(['o2', 'o3']);
    expect(ids({ customerType: 'pj', period: 'ano' })).toEqual(['o1', 'o5']);
  });
});

describe('salesSummary', () => {
  it('sums this month (not failed/refunded), received and receivable', () => {
    expect(salesSummary(orders, NOW)).toEqual({ monthSales: 1500, received: 1500, receivable: 500 });
  });
});

describe('topCustomers', () => {
  it('ranks paid revenue per customer by the chosen sort and cuts at N', () => {
    expect(topCustomers(orders, customers, 'receita', 5)).toEqual([
      { id: 'pj', name: 'Acme', revenue: 1300, orders: 2 },
      { id: 'pf', name: 'Bia', revenue: 200, orders: 1 },
    ]);
    expect(topCustomers(orders, customers, 'nome', 1).map((c) => c.name)).toEqual(['Acme']);
    expect(topCustomers(orders, customers, 'pedidos', 5)[0]?.orders).toBe(2);
  });
});

describe('salesByCourse', () => {
  it('splits paid orders by their items, and puts orders without items under "Outros"', () => {
    expect(salesByCourse(orders, courses)).toEqual(
      [
        { name: 'Outros', value: 500 },
        { name: 'Segurança operacional', value: 600 },
        { name: 'Direção defensiva', value: 400 },
      ].sort((a, b) => b.value - a.value),
    );
  });
});

describe('salesBySector', () => {
  it('groups paid revenue by the customer sector', () => {
    expect(salesBySector(orders, customers, sectors)).toEqual([
      { name: 'Aviação', value: 1300 },
      { name: 'Sem setor', value: 200 },
    ]);
  });
});
