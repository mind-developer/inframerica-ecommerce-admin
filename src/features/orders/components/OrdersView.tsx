'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs, tabPanelProps } from '@/components/ui/Tabs';
import type { Order } from '@/types/orders';
import type { OrderSettings } from '@/types/orderSettings';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { filterOrders, orderTotals } from '../utils/orderFilters';
import { buildOrderLookups, type OrderData } from '../utils/orderLookups';
import { ExportReportButton } from './ExportReportButton';
import { OrderFiltersPanel } from './OrderFiltersPanel';
import { OrderKpis } from './OrderKpis';
import { OrderSettingsTab } from './OrderSettingsTab';
import { OrdersList } from './OrdersList';

interface Props extends OrderData {
  orders: Order[];
  settings: OrderSettings;
}

const TABS = [
  { id: 'lista' as const, label: 'Pedidos' },
  { id: 'config' as const, label: 'Configurações' },
];

export function OrdersView({ orders, settings, customers, courses, enrollments, cohorts, sectors }: Props) {
  const controls = useOrderFilters();
  const lookups = useMemo(
    () => buildOrderLookups({ customers, courses, enrollments, cohorts, sectors }),
    [customers, courses, enrollments, cohorts, sectors],
  );
  const shown = useMemo(() => filterOrders(orders, controls.filters, lookups), [orders, controls.filters, lookups]);
  const tab = controls.params.aba;
  return (
    <>
      <PageHeader
        soon
        title="Pedidos"
        subtitle="Acompanhe vendas, pagamentos e créditos vinculados."
        actions={tab === 'lista' && <ExportReportButton orders={shown} lookups={lookups} />}
      />
      <Tabs idPrefix="orders" tabs={TABS} value={tab} onChange={(aba) => void controls.set({ aba })} className="mb-5" />
      <div {...tabPanelProps('orders', tab)} className="space-y-5">
        {tab === 'config' ? (
          <OrderSettingsTab settings={settings} />
        ) : (
          <>
            <OrderFiltersPanel controls={controls} customers={customers} />
            <OrderKpis totals={orderTotals(shown)} />
            <OrdersList orders={shown} allOrders={orders} lookups={lookups} controls={controls} />
          </>
        )}
      </div>
    </>
  );
}
