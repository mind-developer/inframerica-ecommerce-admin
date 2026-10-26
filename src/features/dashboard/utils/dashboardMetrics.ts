import { coursesOfOrder } from '@/domain/orderCourses';
import type { Course } from '@/types/catalog';
import type { Customer } from '@/types/customers';
import type { Order } from '@/types/orders';
import type { Sector } from '@/types/sectors';
import { civilToday } from '@/utils/civilDate';
import { onlyDigits } from '@/utils/format';

export const PERIODS = ['7d', '30d', '90d', 'ano', 'tudo'] as const;
export type Period = (typeof PERIODS)[number];
export const CUSTOMER_TYPES = ['todos', 'pj', 'pf'] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];
export const RANKING_SORTS = ['receita', 'pedidos', 'nome'] as const;
export type RankingSort = (typeof RANKING_SORTS)[number];

export interface DashboardFilters {
  period: Period;
  sectorId: string | null;
  customerType: CustomerType;
  topN: number;
  sort: RankingSort;
}

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  period: 'tudo',
  sectorId: null,
  customerType: 'todos',
  topN: 5,
  sort: 'receita',
};

const DAY_MS = 86_400_000;
const civilOf = (iso: string) => civilToday(new Date(iso));

/** Cut-off as a Brasília civil date (yyyy-MM-dd); null = all time. */
export function periodStart(period: Period, now: Date = new Date()): string | null {
  if (period === 'tudo') return null;
  if (period === 'ano') return `${civilToday(now).slice(0, 4)}-01-01`;
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  return civilToday(new Date(now.getTime() - days * DAY_MS));
}

/** A customer with a CNPJ (14 digits) is PJ; with a CPF (11), PF. */
export const isCompany = (document: string) => onlyDigits(document).length > 11;

/** Orders after period, sector and customer type. Everything on the dashboard derives from these. */
export function filterDashboardOrders(
  orders: Order[],
  customers: Customer[],
  f: DashboardFilters,
  now: Date = new Date(),
): Order[] {
  const start = periodStart(f.period, now);
  const byId = new Map(customers.map((c) => [c.id, c]));
  return orders.filter((o) => {
    const customer = byId.get(o.customerId);
    if (start && civilOf(o.createdAt) < start) return false;
    if (f.sectorId && customer?.sectorId !== f.sectorId) return false;
    if (f.customerType === 'todos') return true;
    return customer ? isCompany(customer.document) === (f.customerType === 'pj') : false;
  });
}

const paid = (orders: Order[]) => orders.filter((o) => o.status === 'paid');
const sum = (orders: Order[]) => orders.reduce((s, o) => s + o.amount, 0);

export function salesSummary(orders: Order[], now: Date = new Date()) {
  const month = civilToday(now).slice(0, 7);
  return {
    monthSales: sum(
      orders.filter((o) => civilOf(o.createdAt).startsWith(month) && o.status !== 'refunded' && o.status !== 'failed'),
    ),
    received: sum(paid(orders)),
    receivable: sum(orders.filter((o) => o.status === 'pending')),
  };
}

export interface RankedCustomer {
  id: string;
  name: string;
  revenue: number;
  orders: number;
}

/** Customers by confirmed revenue (or order count / name), top N. */
export function topCustomers(
  orders: Order[],
  customers: Customer[],
  sort: RankingSort,
  topN: number,
): RankedCustomer[] {
  const map = new Map<string, RankedCustomer>();
  for (const o of paid(orders)) {
    const entry = map.get(o.customerId) ?? {
      id: o.customerId,
      name: customers.find((c) => c.id === o.customerId)?.name ?? 'Cliente removido',
      revenue: 0,
      orders: 0,
    };
    entry.revenue += o.amount;
    entry.orders += 1;
    map.set(o.customerId, entry);
  }
  const compare: Record<RankingSort, (a: RankedCustomer, b: RankedCustomer) => number> = {
    receita: (a, b) => b.revenue - a.revenue,
    pedidos: (a, b) => b.orders - a.orders,
    nome: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
  };
  return [...map.values()].sort(compare[sort]).slice(0, topN);
}

export interface ChartDatum {
  name: string;
  value: number;
}

const toChart = (map: Map<string, number>): ChartDatum[] =>
  [...map].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
const add = (map: Map<string, number>, key: string, value: number) => map.set(key, (map.get(key) ?? 0) + value);

/**
 * Confirmed revenue per course. Orders with items split their amount by item share (so the bars add up
 * to the revenue even with a discount); orders without items fall back to the title heuristic, else "Outros".
 */
export function salesByCourse(orders: Order[], courses: Course[]): ChartDatum[] {
  const map = new Map<string, number>();
  const title = new Map(courses.map((c) => [c.id, c.title]));
  for (const o of paid(orders)) {
    const gross = o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    if (gross > 0) {
      for (const i of o.items)
        add(map, title.get(i.courseId) ?? 'Outros', (o.amount * i.unitPrice * i.quantity) / gross);
      continue;
    }
    add(map, coursesOfOrder(o, courses)[0]?.title ?? 'Outros', o.amount);
  }
  return toChart(map);
}

/** Confirmed revenue per customer sector. */
export function salesBySector(orders: Order[], customers: Customer[], sectors: Sector[]): ChartDatum[] {
  const map = new Map<string, number>();
  for (const o of paid(orders)) {
    const sectorId = customers.find((c) => c.id === o.customerId)?.sectorId;
    add(map, sectors.find((s) => s.id === sectorId)?.name ?? 'Sem setor', o.amount);
  }
  return toChart(map);
}
