import { createLoader, type SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getSectorOrders } from '@/features/orders/server';
import { CustomersView } from '../components/CustomersView';
import { getCustomer, listCustomers } from '@/services/customers.service';
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
  const [result, orders] = await Promise.all([listCustomers(params), getSectorOrders(admin)]);
  // `?id=` (links from Pedidos) may point to a customer on another page.
  const opened = params.id ? (result.items.find((c) => c.id === params.id) ?? (await getCustomer(params.id))) : null;
  return <CustomersView result={result} opened={opened} orders={orders} />;
}
