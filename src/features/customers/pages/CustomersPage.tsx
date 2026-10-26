import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';
import { getOrders } from '@/features/orders/server';
import { getSectors } from '@/features/sectors/server';
import { CustomersView } from '../components/CustomersView';
import { getCustomers } from '../data/customers';

export function CustomersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CustomersContent />
    </Suspense>
  );
}

async function CustomersContent() {
  await requireAdmin();
  const [customers, sectors, orders] = await Promise.all([getCustomers(), getSectors(), getOrders()]);
  return <CustomersView customers={customers} sectors={sectors} orders={orders} />;
}
