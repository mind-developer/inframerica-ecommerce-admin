import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';
import { getCourses } from '@/features/courses/server';
import { getCustomers } from '@/features/customers/server';
import { getOrders } from '@/features/orders/server';
import { getSectors } from '@/features/sectors/server';
import { DashboardView } from '../components/DashboardView';

export function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral da operação" />
      <Suspense fallback={<PageSkeleton rows={6} />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}

async function DashboardContent() {
  await requireAdmin();
  const [orders, customers, courses, sectors] = await Promise.all([
    getOrders(),
    getCustomers(),
    getCourses(),
    getSectors(),
  ]);
  return <DashboardView orders={orders} customers={customers} courses={courses} sectors={sectors} />;
}
