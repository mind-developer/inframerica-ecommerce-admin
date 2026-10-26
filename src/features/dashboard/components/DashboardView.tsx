'use client';

import { Building2, CheckCircle2, Clock, DollarSign, GraduationCap, UserCircle } from 'lucide-react';
import { useMemo } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Course } from '@/types/catalog';
import type { Customer } from '@/types/customers';
import type { Order } from '@/types/orders';
import type { Sector } from '@/types/sectors';
import { formatBRLWhole } from '@/utils/format';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import {
  filterDashboardOrders,
  salesByCourse,
  salesBySector,
  salesSummary,
  topCustomers,
} from '../utils/dashboardMetrics';
import { DashboardFiltersPanel } from './DashboardFiltersPanel';
import { SalesBarChart } from './SalesBarChart';
import { StatCards, type Stat } from './StatCards';
import { TopCustomersCard } from './TopCustomersCard';

interface Props {
  orders: Order[];
  customers: Customer[];
  courses: Course[];
  sectors: Sector[];
}

export function DashboardView({ orders, customers, courses, sectors }: Props) {
  const controls = useDashboardFilters();
  const { filters } = controls;
  const shown = useMemo(() => filterDashboardOrders(orders, customers, filters), [orders, customers, filters]);
  const summary = salesSummary(shown);
  const stats: Stat[] = [
    { label: 'Setores', value: String(sectors.filter((s) => s.active).length), Icon: Building2, href: '/setores' },
    {
      label: 'Cursos ativos',
      value: String(courses.filter((c) => c.active).length),
      Icon: GraduationCap,
      href: '/cursos',
    },
    { label: 'Clientes', value: String(customers.length), Icon: UserCircle, href: '/clientes' },
    { label: 'Vendas no mês', value: formatBRLWhole(summary.monthSales), Icon: DollarSign },
    { label: 'Total recebido', value: formatBRLWhole(summary.received), Icon: CheckCircle2 },
    { label: 'Total a receber', value: formatBRLWhole(summary.receivable), Icon: Clock },
  ];
  return (
    <div className="space-y-6">
      <DashboardFiltersPanel controls={controls} sectors={sectors} />
      {orders.length === 0 ? (
        <EmptyState title="Nenhum pagamento registrado ainda — os indicadores aparecem quando houver movimento." />
      ) : (
        <>
          <StatCards stats={stats} />
          <TopCustomersCard customers={topCustomers(shown, customers, filters.sort, filters.topN)} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <SalesBarChart
              className="lg:col-span-3"
              title="Vendas por curso"
              description="Receita realizada (pagamentos confirmados)"
              data={salesByCourse(shown, courses)}
            />
            <SalesBarChart
              className="lg:col-span-2"
              horizontal
              title="Vendas por setor"
              description="Receita por setor do cliente"
              data={salesBySector(shown, customers, sectors)}
            />
          </div>
        </>
      )}
    </div>
  );
}
