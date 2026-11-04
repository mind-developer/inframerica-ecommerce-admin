import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getCourses } from '@/features/courses/server';
import { getCustomers } from '@/features/customers/server';
import { CouponsView } from '../components/CouponsView';
import { getCoupons } from '../data/coupons';

export function CouponsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CouponsContent />
    </Suspense>
  );
}

async function CouponsContent() {
  await requireScreen('coupons');
  const [coupons, courses, customers] = await Promise.all([getCoupons(), getCourses(), getCustomers()]);
  return <CouponsView coupons={coupons} courses={courses} customers={customers} />;
}
