import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getCohorts, getEnrollments } from '@/features/cohorts/server';
import { getCourses } from '@/features/courses/server';
import { getCustomers } from '@/features/customers/server';
import { getSectors } from '@/features/sectors/server';
import { getCachedOrderSettings } from '@/features/settings/server';
import { OrdersView } from '../components/OrdersView';
import { getSectorOrders } from '../data/orders';

export function OrdersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const admin = await requireScreen('orders');
  const [orders, customers, courses, enrollments, cohorts, sectors, settings] = await Promise.all([
    getSectorOrders(admin),
    getCustomers(),
    getCourses(),
    getEnrollments(),
    getCohorts(),
    getSectors(),
    getCachedOrderSettings(),
  ]);
  return (
    <OrdersView
      orders={orders}
      customers={customers}
      courses={courses}
      enrollments={enrollments}
      cohorts={cohorts}
      sectors={sectors}
      settings={settings}
    />
  );
}
