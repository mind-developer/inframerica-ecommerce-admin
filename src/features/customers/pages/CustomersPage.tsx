import { createLoader, type SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getSectorOrders } from '@/features/orders/server';
import { CustomersView } from '../components/CustomersView';
import { listCustomers } from '@/services/customers.service';
import { customerListParams } from '../utils/customerListParams';

const loadParams = createLoader(customerListParams);

export function CustomersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CustomersContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CustomersContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const admin = await requireScreen('customers');
  const params = await loadParams(searchParams);
  const [customers, orders] = await Promise.all([listCustomers(params), getSectorOrders(admin)]);
  return <CustomersView customers={customers} orders={orders} />;
}
