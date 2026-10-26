import type { Customer } from '@/types/customers';
import type { Enrollment } from '@/types/enrollments';
import type { Order, OrderStatus, PaymentMethod, ServiceType } from '@/types/orders';
import { onlyDigits } from '@/utils/format';

export const ORDER_SORTS = ['recente', 'antigo', 'maior', 'menor'] as const;
export type OrderSort = (typeof ORDER_SORTS)[number];

export interface OrderFilters {
  q: string;
  status: OrderStatus | null;
  method: PaymentMethod | null;
  service: ServiceType | null;
  customerId: string | null;
  sort: OrderSort;
  invoice: 'com' | 'sem' | null;
  billed: 'sim' | 'nao' | null;
  excludeAccountHolders: boolean;
}

const hashPct = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 100;
};

/** MOCK: invoice and billing don't exist on orders yet; derived from the id to exercise the filters (SAP/NF gaps). */
export const hasInvoice = (o: Order) => o.status === 'paid' && hashPct(`${o.id}nf`) >= 20;
export const isBilled = (o: Order) => o.status === 'paid' && hashPct(`${o.id}fat`) >= 15;

export interface FilterContext {
  customerOf: (id: string) => Customer | undefined;
  studentsOf: (o: Order) => Enrollment[];
}

const matchesText = (o: Order, term: string, digits: string, { customerOf, studentsOf }: FilterContext) => {
  const customer = customerOf(o.customerId);
  const hasDigits = (value?: string) => digits !== '' && onlyDigits(value ?? '').includes(digits);
  return (
    [o.description, o.reference, o.id, customer?.name, customer?.email].some((v) =>
      (v ?? '').toLowerCase().includes(term),
    ) ||
    hasDigits(customer?.document) ||
    hasDigits(customer?.cnpj) ||
    studentsOf(o).some(
      (m) =>
        m.personName.toLowerCase().includes(term) ||
        m.personEmail.toLowerCase().includes(term) ||
        hasDigits(m.personCpf),
    )
  );
};

/** The orders screen's search, filters and sort; search also finds linked people by name, e-mail or CPF. */
export function filterOrders(orders: Order[], f: OrderFilters, ctx: FilterContext): Order[] {
  const term = f.q.trim().toLowerCase();
  const digits = onlyDigits(f.q);
  const list = orders.filter(
    (o) =>
      (!f.status || o.status === f.status) &&
      (!f.method || o.method === f.method) &&
      (!f.service || (o.serviceType ?? 'training') === f.service) &&
      (!f.customerId || o.customerId === f.customerId) &&
      (!f.invoice || hasInvoice(o) === (f.invoice === 'com')) &&
      (!f.billed || isBilled(o) === (f.billed === 'sim')) &&
      !(f.excludeAccountHolders && ctx.customerOf(o.customerId)?.billingTag === 'account_holder') &&
      (!term || matchesText(o, term, digits, ctx)),
  );
  return list.sort((a, b) => {
    if (f.sort === 'maior') return b.amount - a.amount;
    if (f.sort === 'menor') return a.amount - b.amount;
    const cmp = a.createdAt.localeCompare(b.createdAt);
    return f.sort === 'antigo' ? cmp : -cmp;
  });
}

/** KPI cards. "Valor bruto" sums `amount`, which the report reads as net (prototype pending item 7). */
export const orderTotals = (orders: Order[]) => ({
  count: orders.length,
  gross: orders.reduce((s, o) => s + o.amount, 0),
  received: orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.amount, 0),
  receivable: orders.filter((o) => o.status === 'pending').reduce((s, o) => s + o.amount, 0),
});
