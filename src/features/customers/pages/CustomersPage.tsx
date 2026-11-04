import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getOrders } from '@/features/orders/server';
import { CustomersView } from '../components/CustomersView';
import { listCustomers } from '@/services/customers.service';

export function CustomersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CustomersContent />
    </Suspense>
  );
}

async function CustomersContent() {
  await requireScreen('customers');
  const [customers, orders] = await Promise.all([listCustomers(), getOrders()]);
  return <CustomersView customers={customers} orders={orders} />;
}
