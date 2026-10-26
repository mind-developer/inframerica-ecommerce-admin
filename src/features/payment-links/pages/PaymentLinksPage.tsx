import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';
import { getCustomers } from '@/features/customers/server';
import { PaymentLinksView } from '../components/PaymentLinksView';
import { getPaymentLinks } from '../data/paymentLinks';

export function PaymentLinksPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PaymentLinksContent />
    </Suspense>
  );
}

async function PaymentLinksContent() {
  await requireAdmin();
  const [links, customers] = await Promise.all([getPaymentLinks(), getCustomers()]);
  return <PaymentLinksView links={links} customers={customers} />;
}
